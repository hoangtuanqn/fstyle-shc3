import { privateApi, publicApi } from '~/utils/axiosInstance';

import type { ApiResponse, LoginInput, LoginResult, UserType } from '~/types/auth';

class AuthApi {
  static login = async (data: LoginInput) => {
    const response = await publicApi.post<ApiResponse<LoginResult>>('/auth/login', data);
    return response.data;
  };

  static getInfo = async () => {
    const response = await privateApi.get<ApiResponse<UserType>>('/auth/get-info');
    return response.data;
  };

  static logout = async () => {
    const response = await privateApi.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  };

  static changePassword = async (data: { newPassword: string; confirmPassword: string }) => {
    const response = await privateApi.post<ApiResponse<null>>('/auth/change-password', data);
    return response.data;
  };
}

export default AuthApi;
