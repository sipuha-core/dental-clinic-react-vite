import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'doctor', 'assistant']);
export const userSchema = z.object({
    id: z.string().uuid(),
    first_name: z.string().trim().min(1, 'Имя обязательно'),
    last_name: z.string().trim().min(1, 'Фамилия обязательна'),
    email: z.string().email('Некорректный email'),
    phone: z.string().regex(/^8\d{10}$/, 'Телефон должен начинаться с 8 и содержать 11 цифр').nullable(),
    role: userRoleSchema,
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const createUserSchema = z.object({
    first_name: userSchema.shape.first_name,
    last_name: userSchema.shape.last_name,
    email: userSchema.shape.email,
    phone: userSchema.shape.phone,
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    role: userSchema.shape.role,
});

export const updateUserSchema = z.object({
    first_name: userSchema.shape.first_name,
    last_name: userSchema.shape.last_name,
    email: userSchema.shape.email,
    phone: userSchema.shape.phone,
    password: z.string().optional().refine((val) => !val || val.length >= 6, { message: 'Минимум 6 символов', }),
    role: userSchema.shape.role,
    is_active: userSchema.shape.is_active,
})