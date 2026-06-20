import { getIO } from '~/configs/socket';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';
import awardRepository from '~/repositories/award.repository';
import scoringService from '~/services/scoring.service';

class AwardService {
  getAll = async () => {
    return await awardRepository.findAll();
  };

  updateAward = async (
    awardId: string,
    data: { winnerTeamId?: string | null; winnerUserId?: string | null; winnerName?: string | null },
  ) => {
    const award = await awardRepository.findById(awardId);
    if (!award) {
      throw new ErrorWithStatus({ message: 'Giải thưởng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    if (award.type === 'AUTO') {
      throw new ErrorWithStatus({ message: 'Không thể chỉnh sửa giải tự động!', status: HTTP_STATUS.BAD_REQUEST });
    }
    await awardRepository.updateWinner(awardId, data);
    const updated = await awardRepository.findById(awardId);
    getIO().emit('awards:updated', { awardId, award: updated });
    return updated;
  };

  autoCalculate = async () => {
    const teamsWithScores = await scoringService.getTeams();
    const sorted = [...teamsWithScores].sort((a, b) => b.totalScore - a.totalScore);

    const allAwards = await awardRepository.findAll();
    const autoAwards = allAwards.filter((a) => a.type === 'AUTO').sort((a, b) => a.displayOrder - b.displayOrder);

    for (let i = 0; i < autoAwards.length && i < sorted.length; i++) {
      await awardRepository.updateWinner(autoAwards[i].id, {
        winnerTeamId: sorted[i].id,
        winnerName: sorted[i].name,
      });
    }

    getIO().emit('awards:updated', { type: 'auto-calculate' });
    return await awardRepository.findAll();
  };
}

export default new AwardService();
