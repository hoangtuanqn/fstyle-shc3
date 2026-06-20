import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { CandidateType, VoteType } from '~/types/voting';

class VotingApi {
  static getCandidates = async () => {
    const response = await privateApi.get<ApiResponse<CandidateType[]>>('/voting/candidates');
    return response.data;
  };

  static getMyVotes = async () => {
    const response = await privateApi.get<ApiResponse<VoteType[]>>('/voting/my-votes');
    return response.data;
  };

  static vote = async (candidateId: string) => {
    const response = await privateApi.post<ApiResponse<null>>('/voting/vote', { candidateId });
    return response.data;
  };

  static removeVote = async (candidateId: string) => {
    const response = await privateApi.delete<ApiResponse<null>>(`/voting/vote/${candidateId}`);
    return response.data;
  };
}

export default VotingApi;
