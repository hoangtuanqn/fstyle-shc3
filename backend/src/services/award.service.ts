import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { getIO } from '~/configs/socket';
import { ErrorWithStatus } from '~/rules/error';
import awardRepository from '~/repositories/award.repository';
import scoringService from '~/services/scoring.service';

type WinnerInput = {
  slot: number;
  winnerTeamId?: string | null;
  winnerUserId?: string | null;
  winnerName?: string | null;
};

const canEditAward = (role: RoleType, displayOrder: number): boolean => {
  if (role === RoleType.ADMIN) return true;
  if (role === RoleType.BTC_FSTYLE) return displayOrder >= 4 && displayOrder <= 8;
  return false;
};

class AwardService {
  getAll = async () => {
    return await awardRepository.findAll();
  };

  updateAward = async (awardId: string, role: RoleType, winners: WinnerInput[]) => {
    const award = await awardRepository.findById(awardId);
    if (!award) {
      throw new ErrorWithStatus({ message: 'Giải thưởng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    if (award.type === 'AUTO') {
      throw new ErrorWithStatus({ message: 'Không thể chỉnh sửa giải tự động!', status: HTTP_STATUS.BAD_REQUEST });
    }
    if (!canEditAward(role, award.displayOrder)) {
      throw new ErrorWithStatus({ message: 'Bạn không có quyền chỉnh sửa giải thưởng này!', status: HTTP_STATUS.FORBIDDEN });
    }

    const invalidSlots = winners.filter((w) => w.slot < 1 || w.slot > award.quantity);
    if (invalidSlots.length > 0) {
      throw new ErrorWithStatus({
        message: `Slot không hợp lệ! Giải "${award.name}" chỉ có ${award.quantity} slot.`,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const slots = winners.map((w) => w.slot);
    if (new Set(slots).size !== slots.length) {
      throw new ErrorWithStatus({ message: 'Không được trùng slot!', status: HTTP_STATUS.BAD_REQUEST });
    }

    await awardRepository.deleteWinnersByAwardId(awardId);
    await awardRepository.insertWinners(
      winners.map((w) => ({
        awardId,
        slot: w.slot,
        winnerTeamId: w.winnerTeamId ?? null,
        winnerUserId: w.winnerUserId ?? null,
        winnerName: w.winnerName ?? null,
      })),
    );

    const updated = await awardRepository.findById(awardId);
    getIO().emit('awards:updated', { awardId, award: updated });
    return updated;
  };

  autoCalculate = async () => {
    const teamsWithScores = await scoringService.getTeams();
    const sorted = [...teamsWithScores].sort((a, b) => b.totalScore - a.totalScore);

    const allAwards = await awardRepository.findAll();
    const autoAwards = allAwards.filter((a) => a.type === 'AUTO').sort((a, b) => a.displayOrder - b.displayOrder);

    let teamCursor = 0;
    for (const award of autoAwards) {
      await awardRepository.deleteWinnersByAwardId(award.id);

      const winnersToInsert: { awardId: string; slot: number; winnerTeamId: string; winnerName: string }[] = [];

      for (let slot = 1; slot <= award.quantity && teamCursor < sorted.length; slot++) {
        winnersToInsert.push({
          awardId: award.id,
          slot,
          winnerTeamId: sorted[teamCursor].id,
          winnerName: sorted[teamCursor].name,
        });
        teamCursor++;
      }

      await awardRepository.insertWinners(winnersToInsert);
    }

    getIO().emit('awards:updated', { type: 'auto-calculate' });
    return await awardRepository.findAll();
  };
}

export default new AwardService();
