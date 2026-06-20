import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { AwardType, UpdateAwardInput } from '~/types/award';

class AwardApi {
  static getAll = async () => {
    const response = await privateApi.get<ApiResponse<AwardType[]>>('/awards');
    return response.data;
  };

  static updateAward = async ({ awardId, data }: { awardId: string; data: UpdateAwardInput }) => {
    const response = await privateApi.put<ApiResponse<AwardType>>(`/awards/${awardId}`, data);
    return response.data;
  };

  static autoCalculate = async () => {
    const response = await privateApi.post<ApiResponse<AwardType[]>>('/awards/auto-calculate');
    return response.data;
  };
}

export default AwardApi;
