import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ!'),
    password: z.string().trim().min(1, 'Mật khẩu không được để trống!'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z.string().trim().min(1, 'Refresh token không được để trống!'),
  }),
});
