import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { BtcScoreInput, JudgeScoresInput, TeamScoreDetail, TeamScoreSummary, TeamStatistic } from '~/types/scoring';

class ScoringApi {
  static getTeams = async () => {
    const response = await privateApi.get<ApiResponse<TeamScoreSummary[]>>('/scoring/teams');
    return response.data;
  };

  static getTeamScores = async (teamId: string) => {
    const response = await privateApi.get<ApiResponse<TeamScoreDetail>>(`/scoring/teams/${teamId}`);
    return response.data;
  };

  static saveJudgeScores = async ({ teamId, data }: { teamId: string; data: JudgeScoresInput }) => {
    const response = await privateApi.put<ApiResponse<null>>(`/scoring/judge-scores/${teamId}`, data);
    return response.data;
  };

  static saveBtcScore = async ({ teamId, data }: { teamId: string; data: BtcScoreInput }) => {
    const response = await privateApi.put<ApiResponse<null>>(`/scoring/btc-scores/${teamId}`, data);
    return response.data;
  };

  static getStatistics = async () => {
    const response = await privateApi.get<ApiResponse<TeamStatistic[]>>('/scoring/statistics');
    return response.data;
  };
}

export default ScoringApi;
