import { toast } from 'sonner';

import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type {
  CreateUserInput,
  CreateUserResult,
  ResetPasswordResult,
  TeamType,
  UpdateUserInput,
  UserAdminType,
} from '~/types/user';

class UserApi {
  static getAll = async (params?: { role?: string; teamId?: string; search?: string }) => {
    const response = await privateApi.get<ApiResponse<UserAdminType[]>>('/users', { params });
    return response.data;
  };

  static getTeams = async () => {
    const response = await privateApi.get<ApiResponse<TeamType[]>>('/users/teams');
    return response.data;
  };

  static create = async (data: CreateUserInput) => {
    const response = await privateApi.post<ApiResponse<CreateUserResult>>('/users', data);
    return response.data;
  };

  static update = async (id: string, data: UpdateUserInput) => {
    const response = await privateApi.put<ApiResponse<UserAdminType>>(`/users/${id}`, data);
    return response.data;
  };

  static delete = async (id: string) => {
    const response = await privateApi.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  };

  static resetPassword = async (id: string) => {
    const response = await privateApi.post<ApiResponse<ResetPasswordResult>>(`/users/${id}/reset-password`);
    return response.data;
  };

  static exportExcel = () => {
    privateApi
      .get('/users/export', { responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tai-khoan.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Xuất Excel thất bại!'));
  };
}

export default UserApi;
