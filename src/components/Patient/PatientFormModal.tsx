import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPatientSchema } from '../../app/schemas/patient.schema'
import type { Patient } from '../../app/models/patientTypes'
import { useCreatePatientMutation, useUpdatePatientMutation } from '../../app/patientApi'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import 'dayjs/locale/ru'

dayjs.locale('ru')

type CreateInput = z.infer<typeof createPatientSchema>

type Props = {
    isOpen: boolean
    patient?: Patient
    onClose: () => void
}

const PatientFormModal = ({ isOpen, patient, onClose }: Props) => {
    const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation()
    const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation()
    const isSaving = isCreating || isUpdating

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateInput>({
        resolver: zodResolver(createPatientSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            phone: '',
            birth_date: null,
        },
    })

    useEffect(() => {
        if (!isOpen) return

        if (patient) {
            reset({
                first_name: patient.first_name,
                last_name: patient.last_name,
                phone: patient.phone!,
                birth_date: patient.birth_date,
            })
        } else {
            reset({
                first_name: '',
                last_name: '',
                phone: '',
                birth_date: null,
            })
        }
    }, [isOpen, patient, reset])

    if (!isOpen) return null

    const onSubmit = async (data: CreateInput) => {
        try {
            if (patient) {
                await updatePatient({ id: patient.id, data }).unwrap()
            } else {
                await createPatient(data).unwrap()
            }
            reset()
            onClose()
        } catch {
            // ошибка будет обработана через errorMiddleware
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        {patient ? 'Редактировать пациента' : 'Добавить пациента'}
                    </h3>
                    <button type="button" onClick={onClose} className="scale-150 cursor-pointer">
                        <CloseCircleOutlined />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <input
                        {...register('first_name')}
                        placeholder="Имя"
                        className="border p-2 rounded"
                    />
                    {errors.first_name && (
                        <span className="text-red-500 text-sm">{errors.first_name.message}</span>
                    )}

                    <input
                        {...register('last_name')}
                        placeholder="Фамилия"
                        className="border p-2 rounded"
                    />
                    {errors.last_name && (
                        <span className="text-red-500 text-sm">{errors.last_name.message}</span>
                    )}

                    <input
                        {...register('phone')}
                        placeholder="Телефон"
                        className="border p-2 rounded"
                    />
                    {errors.phone && (
                        <span className="text-red-500 text-sm">{errors.phone.message}</span>
                    )}

                    <Controller
                        name="birth_date"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(item) => field.onChange(item ? item.format('YYYY-MM-DD') : null)}
                                format="DD.MM.YYYY"
                                placeholder="Дата рождения"
                                style={{ width: '100%' }}
                            />
                        )}
                    />
                    {errors.birth_date && (
                        <span className="text-red-500 text-sm">{errors.birth_date.message}</span>
                    )}

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md bg-neutral-200 p-2 text-neutral-800 cursor-pointer hover:bg-neutral-300"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 rounded-md bg-blue-600 p-2 text-white cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSaving ? 'Сохранение...' : patient ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PatientFormModal