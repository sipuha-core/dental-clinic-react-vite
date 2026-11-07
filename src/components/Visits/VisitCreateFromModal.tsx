import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Select, DatePicker } from 'antd'
import { useCreateVisitMutation } from '../../app/visitApi'
import { createVisitFormSchema, type CreateVisitFormInput } from '../../app/schemas/visitForm.schema'
import { useGetPatientsQuery } from '../../app/patientApi'
import { useGetUsersQuery } from '../../app/userApi'
import { useGetServicesQuery } from '../../app/serviceApi'
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useCreateVisitServiceMutation } from '../../app/visitServiceApi'

type Props = {
    isOpen: boolean
    onClose: () => void
}

const statusOptions = [
    { value: 'scheduled', label: 'Запланирован' },
    { value: 'in_progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершён' },
    { value: 'cancelled', label: 'Отменён' },
    { value: 'no_show', label: 'Не явился' },
]

const getArrayError = (err: unknown): string | undefined => {
    if (!err || typeof err !== 'object') return undefined
    const e = err as { message?: string; root?: { message?: string } }
    return e.root?.message ?? e.message
}

const VisitCreateFromModal = ({ isOpen, onClose }: Props) => {
    const [createVisit, { isLoading: isCreatingVisit }] = useCreateVisitMutation()
    const [createVisitService, { isLoading: isCreatingServices }] = useCreateVisitServiceMutation()
    const isSaving = isCreatingVisit || isCreatingServices

    const { data: patients = [] } = useGetPatientsQuery({ search: '' })
    const { data: users = [] } = useGetUsersQuery()
    const { data: services = [] } = useGetServicesQuery()

    const doctors = users.filter((item) => item.role === 'doctor')

    const {
        handleSubmit,
        reset,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm<CreateVisitFormInput>({
        resolver: zodResolver(createVisitFormSchema),
        defaultValues: {
            patient_id: '',
            doctor_id: '',
            start_time: '',
            end_time: '',
            status: 'scheduled',
            services: []
        },
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'services' })

    useEffect(() => {
        if (!isOpen) return
        reset({
            patient_id: '',
            doctor_id: '',
            start_time: '',
            end_time: '',
            status: 'scheduled',
            services: []
        })
    }, [isOpen, reset])

    if (!isOpen) return null

    const onSubmit = async (data: CreateVisitFormInput) => {
        let visitCreated = false
        try {
            const { services, ...visitData } = data
            const newVisit = await createVisit(visitData).unwrap()
            visitCreated = true

            for (const item of services) {
                await createVisitService({ visit_id: newVisit.id, ...item }).unwrap()
            }
            onClose()
        } catch {
            if (visitCreated) {
                // ошибка будет отработана чеcрез errorMiddleware
            }
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="w-full max-w-117.5 rounded-xl bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Добавить запись</h3>
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
                                    options={patients.map((item) => ({
                                        value: item.id,
                                        label: `${item.first_name} ${item.last_name}`,
                                    }))}
                                />
                            )}
                        />
                        {errors.patient_id && <span className="text-red-500 text-sm">
                            {errors.patient_id.message}
                        </span>}
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
                                    options={doctors.map((item) => ({
                                        value: item.id,
                                        label: `${item.first_name} ${item.last_name}`,
                                    }))}
                                />
                            )}
                        />
                        {errors.doctor_id &&
                            <span className="text-red-500 text-sm">
                                {errors.doctor_id.message}
                            </span>}
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
                                    onChange={(item) => field.onChange(item ? item.toISOString() : '')}
                                />
                            )}
                        />
                        {errors.start_time &&
                            <span className="text-red-500 text-sm">
                                {errors.start_time.message}
                            </span>}
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
                                    onChange={(item) => field.onChange(item ? item.toISOString() : '')}
                                />
                            )}
                        />
                        {errors.end_time &&
                            <span className="text-red-500 text-sm">
                                {errors.end_time.message}
                            </span>}
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
                        {errors.status &&
                            <span className="text-red-500 text-sm">
                                {errors.status.message}
                            </span>}
                    </div>
                    <button
                        type='button'
                        disabled={isSaving}
                        onClick={() => append({ service_id: '', quantity: 1, price_at_time: 0 })}
                        className="mb-2 flex justify-center">
                        <p className='p-1 hover:bg-neutral-200 w-[30%] rounded-md transition-colors'>
                            + добавить услугу
                        </p>
                    </button>
                    {getArrayError(errors.services) && (
                        <span className="text-red-500 text-sm">{getArrayError(errors.services)}</span>
                    )}
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-[270px_40px_70px_10px] gap-2 items-start w-1/2">
                            <div className="flex flex-col gap-1">
                                <Controller
                                    name={`services.${index}.service_id`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            showSearch
                                            optionFilterProp="label"
                                            placeholder="Услуга"
                                            className="w-full"
                                            options={services.map((item) => ({ value: item.id, label: `${item.name}: ${Math.round(item.price)}₽` }))}
                                            onChange={(value) => {
                                                field.onChange(value)
                                                const svc = services.find((item) => item.id === value)
                                                if (svc) {
                                                    const roundedPrice = Math.round(svc.price)
                                                    setValue(`services.${index}.price_at_time`, roundedPrice)
                                                }
                                            }}
                                        />
                                    )}
                                />
                                {errors.services?.[index]?.service_id && (
                                    <span className="text-red-500 text-xs">
                                        {errors.services[index].service_id.message}
                                    </span>
                                )}
                            </div>
                            <input
                                type="number"
                                min={1}
                                {...register(`services.${index}.quantity`, { valueAsNumber: true })}
                                placeholder="Кол-во"
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="number"
                                step="250"
                                {...register(`services.${index}.price_at_time`, { valueAsNumber: true })}
                                placeholder="Цена"
                                className="border p-2 rounded w-full"
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700 p-2 flex items-center justify-center"
                            >
                                <DeleteOutlined />
                            </button>
                        </div>
                    ))}

                    <button
                        type='submit'
                        disabled={isSaving}
                        className="bg-blue-600 text-white rounded-md p-2 mt-4 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {isSaving ? 'Сохранение...' : 'Создать'}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default VisitCreateFromModal 