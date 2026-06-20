import { ExpiresInTokenType, TokenType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import redisClient from '~/configs/redis';
import userRepository from '~/repositories/user.repository';
import { ErrorWithStatus } from '~/rules/error';
import { AlgoCrypto } from '~/utils/crypto';
import { AlgoJwt } from '~/utils/jwt';

import type { LoginRequestBody } from '~/rules/requests/user.request';

class AuthService {
  login = async (data: LoginRequestBody) => {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Email hoặc mật khẩu không đúng!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const isPasswordValid = await AlgoCrypto.verifyPassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new ErrorWithStatus({
        message: 'Email hoặc mật khẩu không đúng!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const { accessToken, refreshToken } = await this.signAccessAndRefreshToken(user.id, user.role);

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      ...userWithoutPassword,
    };
  };

  refreshToken = async (userId: string, currentRefreshToken: string) => {
    const storedToken = await redisClient.get(`refresh_token:${userId}`);

    if (!storedToken || storedToken !== currentRefreshToken) {
      throw new ErrorWithStatus({
        message: 'Refresh token không hợp lệ!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    const { accessToken, refreshToken } = await this.signAccessAndRefreshToken(userId, user.role);

    return { access_token: accessToken, refresh_token: refreshToken };
  };

  logout = async (userId: string) => {
    await redisClient.del(`refresh_token:${userId}`);
  };

  getInfo = async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }
    return user;
  };

  private signAccessToken = async (userId: string, role: string) => {
    return AlgoJwt.signToken({
      payload: { userId, role, type: TokenType.AccessToken },
      options: { expiresIn: ExpiresInTokenType.AccessToken },
    });
  };

  private signAccessAndRefreshToken = async (userId: string, role: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId, role),
      Promise.resolve(AlgoCrypto.generateOpaqueToken()),
    ]);

    await redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ExpiresInTokenType.RefreshToken);

    return { accessToken, refreshToken };
  };
}

export default new AuthService();
