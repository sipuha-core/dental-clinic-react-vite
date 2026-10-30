import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Select, DatePicker } from 'antd'
import { useUpdateVisitMutation } from '../../app/visitApi'
import { editVisitFormSchema, type EditVisitFormInput } from '../../app/schemas/visitForm.schema'
import { useGetPatientsQuery } from '../../app/patientApi'
import { useGetUsersQuery } from '../../app/userApi'
import { CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Visit } from '../../app/models/visitTypes'

type Props = {
    visit: Visit | null
    onClose: () => void
}

const statusOptions = [
    { value: 'scheduled', label: 'Запланирован' },
    { value: 'in_progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершён' },
    { value: 'cancelled', label: 'Отменён' },
    { value: 'no_show', label: 'Не явился' },
]

const VisitEditFormModal = ({ visit, onClose }: Props) => {
    const [updateVisit, { isLoading }] = useUpdateVisitMutation()
    const { data: patients = [] } = useGetPatientsQuery({ search: '' })
    const { data: users = [] } = useGetUsersQuery()
    const doctors = users.filter((item) => item.role === 'doctor')

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<EditVisitFormInput>({
        resolver: zodResolver(editVisitFormSchema),
        defaultValues: {
            patient_id: '',
            doctor_id: '',
            start_time: '',
            end_time: '',
            status: 'scheduled',
        },
    })

    useEffect(() => {
        if (!visit) return
        reset({
            patient_id: visit.patient_id,
            doctor_id: visit.doctor_id ?? '',
            start_time: visit.start_time,
            end_time: visit.end_time,
            status: visit.status,
        })
    }, [visit, reset])

    if (!visit) return null

    const onSubmit = async (data: EditVisitFormInput) => {
        try {
            await updateVisit({ id: visit.id, data }).unwrap()
            onClose()
        } catch {
            // ошибка будет отработана чеcрез errorMiddleware
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="w-full max-w-117.5 rounded-xl bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Редактировать запись</h3>
                    <button onClick={onClose} className="scale-150 cursor-pointer border-none bg-transparent">
                        <CloseCircleOutlined />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="patient_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder="Пациент"
                                    className="w-full"
                                    options={patients.map((p) => ({
                                        value: p.id,
                                        label: `${p.first_name} ${p.last_name}`,
                                    }))}
                                />
                            )}
                        />
                        {errors.patient_id && (
                            <span className="text-red-500 text-sm">{errors.patient_id.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="doctor_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder="Врач"
                                    className="w-full"
                                    options={doctors.map((d) => ({
                                        value: d.id,
                                        label: `${d.first_name} ${d.last_name}`,
                                    }))}
                                />
                            )}
                        />
                        {errors.doctor_id && (
                            <span className="text-red-500 text-sm">{errors.doctor_id.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="start_time"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    showTime
                                    format="DD.MM.YYYY HH:mm"
                                    placeholder="Время начала"
                                    className="w-full"
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                                />
                            )}
                        />
                        {errors.start_time && (
                            <span className="text-red-500 text-sm">{errors.start_time.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="end_time"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    showTime
                                    format="DD.MM.YYYY HH:mm"
                                    placeholder="Время окончания"
                                    className="w-full"
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(v) => field.onChange(v ? v.toISOString() : '')}
                                />
                            )}
                        />
                        {errors.end_time && (
                            <span className="text-red-500 text-sm">{errors.end_time.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Статус"
                                    className="w-full"
                                    options={statusOptions}
                                />
                            )}
                        />
                        {errors.status && (
                            <span className="text-red-500 text-sm">{errors.status.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white rounded-md p-2 mt-4 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default VisitEditFormModal