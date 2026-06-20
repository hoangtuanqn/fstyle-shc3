import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import userRepository from '~/repositories/user.repository';
import votingRepository from '~/repositories/voting.repository';
import { ErrorWithStatus } from '~/rules/error';

const VOTE_START = new Date('2026-06-29T00:00:00+07:00');
const VOTE_END = new Date('2026-07-03T23:59:59+07:00');
const MAX_VOTES_PER_SCOPE = 2;

class VotingService {
  getCandidates = async (userId: string, role: RoleType) => {
    if (role === RoleType.MEMBER) {
      const user = await userRepository.findById(userId);
      if (!user?.teamId) {
        throw new ErrorWithStatus({ message: 'Bạn chưa thuộc đội nào!', status: HTTP_STATUS.BAD_REQUEST });
      }
      return await votingRepository.findCandidatesByTeam(user.teamId);
    }
    return await votingRepository.findAllCandidatesGrouped();
  };

  getMyVotes = async (userId: string) => {
    return await votingRepository.findVotesByVoter(userId);
  };

  vote = async (userId: string, role: RoleType, candidateId: string) => {
    this.checkVotingPeriod();

    if (userId === candidateId) {
      throw new ErrorWithStatus({ message: 'Không thể vote cho chính mình!', status: HTTP_STATUS.BAD_REQUEST });
    }

    const voter = await userRepository.findById(userId);
    if (!voter) {
      throw new ErrorWithStatus({ message: 'Người dùng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }

    const candidate = await userRepository.findById(candidateId);
    if (!candidate || candidate.role !== RoleType.MEMBER) {
      throw new ErrorWithStatus({ message: 'Ứng viên không hợp lệ!', status: HTTP_STATUS.NOT_FOUND });
    }

    if (role === RoleType.MEMBER) {
      if (!voter.teamId || candidate.teamId !== voter.teamId) {
        throw new ErrorWithStatus({ message: 'Chỉ được vote thành viên trong team!', status: HTTP_STATUS.FORBIDDEN });
      }
      const existingVotes = await votingRepository.findVotesByVoter(userId);
      if (existingVotes.length >= MAX_VOTES_PER_SCOPE) {
        throw new ErrorWithStatus({ message: `Tối đa ${MAX_VOTES_PER_SCOPE} lượt vote!`, status: HTTP_STATUS.BAD_REQUEST });
      }
    }

    if (role === RoleType.BTC_FSTYLE) {
      const candidateTeamId = candidate.teamId!;
      const teamVotes = await votingRepository.findVotesByVoterAndTeam(userId, candidateTeamId);
      if (teamVotes.length >= MAX_VOTES_PER_SCOPE) {
        throw new ErrorWithStatus({
          message: `Tối đa ${MAX_VOTES_PER_SCOPE} lượt vote mỗi đội!`,
          status: HTTP_STATUS.BAD_REQUEST,
        });
      }
    }

    await votingRepository.createVote(userId, candidateId);
  };

  removeVote = async (userId: string, candidateId: string) => {
    this.checkVotingPeriod();
    await votingRepository.deleteVote(userId, candidateId);
  };

  private checkVotingPeriod = () => {
    const now = new Date();
    if (now < VOTE_START || now > VOTE_END) {
      throw new ErrorWithStatus({
        message: 'Ngoài thời gian bình chọn! (29/6 → 3/7/2026)',
        status: HTTP_STATUS.FORBIDDEN,
      });
    }
  };
}

export default new VotingService();
