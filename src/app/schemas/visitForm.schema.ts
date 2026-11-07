import { z } from 'zod'
import { visitStatusSchema } from './visit.schema'

const dateTimeString = z.string().refine(
    (v) => !Number.isNaN(Date.parse(v)),
    { message: 'Некорректный формат даты/времени' }
)

const visitServiceItemSchema = z.object({
    id: z.string().optional(),
    service_id: z.string().min(1, 'Выберите услугу'),
    quantity: z.number().int().positive('Количество должно быть больше 0'),
    price_at_time: z.number().nonnegative('Цена не может быть отрицательной'),
})

const base = z.object({
    patient_id: z.string().min(1, 'Выберите пациента'),
    doctor_id: z.string().min(1, 'Выберите врача'),
    start_time: dateTimeString,
    end_time: dateTimeString,
    status: visitStatusSchema,
    services: z.array(visitServiceItemSchema).min(1, { message: 'Добавьте хотя бы одну услугу' }),
})

export const createVisitFormSchema = base.refine(
    (v) => new Date(v.start_time) <= new Date(v.end_time),
    { message: 'Время окончания должно быть позже начала', path: ['end_time'] }
)

export const editVisitFormSchema = base.refine(
    (v) => new Date(v.start_time) <= new Date(v.end_time),
    { message: 'Время окончания должно быть позже начала', path: ['end_time'] }
)

export type CreateVisitFormInput = z.infer<typeof createVisitFormSchema>
export type EditVisitFormInput = z.infer<typeof editVisitFormSchema>
