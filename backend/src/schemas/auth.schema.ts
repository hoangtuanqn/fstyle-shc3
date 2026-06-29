import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ!'),
    password: z.string().trim().min(1, 'Mật khẩu không được để trống!'),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      newPassword: z.string().trim().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự!'),
      confirmPassword: z.string().trim().min(1, 'Xác nhận mật khẩu không được để trống!'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp!',
      path: ['confirmPassword'],
    }),
});

