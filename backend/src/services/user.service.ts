import { HTTP_STATUS } from '~/constants/httpStatus';
import userRepository from '~/repositories/user.repository';
import { ErrorWithStatus } from '~/rules/error';
import { AlgoCrypto } from '~/utils/crypto';
import { generateStrongPassword } from '~/utils/password';

class UserService {
  getAll = async (filter: { role?: string; teamId?: string; search?: string }) => {
    return await userRepository.findAll(filter);
  };

  getTeams = async () => {
    return await userRepository.findAllTeams();
  };

  create = async (data: { name: string; email: string; role: 'ADMIN' | 'BTC_FSTYLE' | 'MC' | 'MEMBER'; teamId: string | null }) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ErrorWithStatus({
        message: 'Email đã được sử dụng!',
        status: HTTP_STATUS.CONFLICT,
      });
    }
    const rawPassword = generateStrongPassword();
    const password = AlgoCrypto.hashPassword(rawPassword);
    const id = await userRepository.create({ ...data, password, rawPassword });
    const user = await userRepository.findById(id);
    return { user, rawPassword };
  };

  update = async (
    id: string,
    data: { name?: string; email?: string; role?: 'ADMIN' | 'BTC_FSTYLE' | 'MC' | 'MEMBER'; teamId?: string | null },
  ) => {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new ErrorWithStatus({ message: 'Người dùng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    if (data.email && data.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(data.email);
      if (emailTaken) {
        throw new ErrorWithStatus({ message: 'Email đã được sử dụng!', status: HTTP_STATUS.CONFLICT });
      }
    }
    await userRepository.update(id, data);
    return await userRepository.findById(id);
  };

  delete = async (id: string) => {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new ErrorWithStatus({ message: 'Người dùng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    await userRepository.deleteById(id);
  };

  resetPassword = async (id: string) => {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new ErrorWithStatus({ message: 'Người dùng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    const rawPassword = generateStrongPassword();
    const password = AlgoCrypto.hashPassword(rawPassword);
    await userRepository.resetPassword(id, password, rawPassword);
    return { rawPassword };
  };
}

export default new UserService();
