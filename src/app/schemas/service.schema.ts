import { z } from 'zod';

export const serviceSchema = z.object({
    id: z.string().uuid(),
    name: z.string().trim().min(1, 'Название обязательно'),
    description: z.string().trim().min(1, 'Описание не должно быть пустым').nullable(),
    code: z.string().trim().min(1, 'Введите код услуги').nullable(),
    price: z.number().nonnegative('Цена не может быть отрицательной'),
    duration: z.number().int().positive('Длительность должна быть больше 0'),
    created_at: z.string(),
    updated_at: z.string(),
});

export const createServiceSchema = serviceSchema.pick({
    name: true,
    description: true,
    code: true,
    price: true,
    duration: true,
});

export const updateServiceSchema = createServiceSchema.partial();
