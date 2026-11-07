import { z } from 'zod';

const requiredName = z.string().trim().min(1, 'Поле обязательно');

export const patientSchema = z.object({
    id: z.string().uuid(),
    first_name: requiredName,
    last_name: requiredName,
    phone: z.string()
        .trim()
        .min(1, 'Поле обязательно. Введите номер телефона')
        .regex(/^\+?[\d\s()-]{10,25}$/, 'Некорректный формат телефона')
        .transform((val) => {
            const cleaned = val.replace(/[^\d+]/g, '')
            if (cleaned.startsWith('8') && cleaned.length === 11)
                return '+7' + cleaned.slice(1)

            if (cleaned.startsWith('7') && cleaned.length === 11)
                return '+' + cleaned

            return cleaned;
        }).refine(
            (val) => val.replace(/\D/g, '').length === 11,
            'Номер телефона должен содержать 11 цифр'
        ),
    birth_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ожидается дд.мм.гггг')
        .refine(val => !isNaN(Date.parse(val)), 'Дата указана неверно')
        .nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const createPatientSchema = patientSchema.pick({
    first_name: true,
    last_name: true,
    phone: true,
    birth_date: true,
});

export const updatePatientSchema = createPatientSchema.partial();
