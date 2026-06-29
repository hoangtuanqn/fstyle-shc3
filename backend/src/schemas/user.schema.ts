import { z } from 'zod';

const roleEnum = z.enum(['ADMIN', 'BTC_FSTYLE', 'MC', 'MEMBER']);

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, 'Tên không được để trống!'),
      email: z.string().trim().email('Email không hợp lệ!'),
      role: roleEnum,
      teamId: z.string().nullable().optional(),
    })
    .refine(
      (data) => {
        if (data.role === 'MEMBER' && !data.teamId) return false;
        if (data.role !== 'MEMBER' && data.teamId) return false;
        return true;
      },
      { message: 'MEMBER phải thuộc team; ADMIN/BTC_FSTYLE/MC không được có team!' },
    ),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().trim().min(1, 'Tên không được để trống!').optional(),
      email: z.string().trim().email('Email không hợp lệ!').optional(),
      role: roleEnum.optional(),
      teamId: z.string().nullable().optional(),
    })
    .refine(
      (data) => {
        if (data.role === 'MEMBER' && data.teamId === null) return false;
        if (data.role && data.role !== 'MEMBER' && data.teamId) return false;
        return true;
      },
      { message: 'MEMBER phải thuộc team; ADMIN/BTC_FSTYLE/MC không được có team!' },
    ),
});

export const userIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1, 'ID không hợp lệ!') }),
});
