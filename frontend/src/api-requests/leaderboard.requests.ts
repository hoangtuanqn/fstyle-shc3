import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { LeaderboardData } from '~/types/leaderboard';

class LeaderboardApi {
  static getLeaderboard = async () => {
    const response = await privateApi.get<ApiResponse<LeaderboardData>>('/leaderboard');
    return response.data;
  };
}

export default LeaderboardApi;
