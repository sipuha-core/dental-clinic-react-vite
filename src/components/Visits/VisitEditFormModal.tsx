import { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Select, DatePicker } from 'antd'
import { useUpdateVisitMutation } from '../../app/visitApi'
import { editVisitFormSchema, type EditVisitFormInput } from '../../app/schemas/visitForm.schema'
import { useGetPatientsQuery } from '../../app/patientApi'
import { useGetUsersQuery } from '../../app/userApi'
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Visit } from '../../app/models/visitTypes'
import { useCreateVisitServiceMutation, useDeleteVisitServiceMutation, useGetVisitServicesByVisitQuery, useUpdateVisitServiceMutation } from '../../app/visitServiceApi'
import { useGetServicesQuery } from '../../app/serviceApi'

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

const getArrayError = (err: unknown): string | undefined => {
    if (!err || typeof err !== 'object') return undefined
    const e = err as { message?: string; root?: { message?: string } }
    return e.root?.message ?? e.message
}

const VisitEditFormModal = ({ visit, onClose }: Props) => {
    const [updateVisit, { isLoading: isUpdatingVisit }] = useUpdateVisitMutation()
    const [createVisitService, { isLoading: isCreatingService }] = useCreateVisitServiceMutation()
    const [updateVisitService, { isLoading: isUpdatingService }] = useUpdateVisitServiceMutation()
    const [deleteVisitService, { isLoading: isDeletingService }] = useDeleteVisitServiceMutation()
    const isSaving = isUpdatingVisit || isCreatingService || isUpdatingService || isDeletingService

    const { data: patients = [] } = useGetPatientsQuery({ search: '' })
    const { data: users = [] } = useGetUsersQuery()
    const { data: services = [] } = useGetServicesQuery()
    const doctors = users.filter((item) => item.role === 'doctor')

    const { data: visitServices = [], isLoading: isLoadingServices } = useGetVisitServicesByVisitQuery(visit?.id ?? '', { skip: !visit })

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        register,
        formState: { errors },
    } = useForm<EditVisitFormInput>({
        resolver: zodResolver(editVisitFormSchema),
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
    const hasResetForVisitRef = useRef<string | null>(null)

    useEffect(() => {
        if (!visit) return
        if (isLoadingServices) return
        if (hasResetForVisitRef.current === visit.id) return
        reset({
            patient_id: visit.patient_id,
            doctor_id: visit.doctor_id,
            start_time: visit.start_time,
            end_time: visit.end_time,
            status: visit.status,
            services: visitServices.map((s) => ({
                id: s.id,
                service_id: s.service_id,
                quantity: s.quantity,
                price_at_time: s.price_at_time,
            }))
        })
    }, [visit, reset, isLoadingServices, visitServices])

    if (!visit) return null

    const onSubmit = async (data: EditVisitFormInput) => {
        const { services: formServices, ...visitData } = data
        const formIds = new Set(
            formServices
                .map((item) => item.id)
                .filter((id): id is string => !!id)
        )
        const toDelete = visitServices.filter((s) => !formIds.has(s.id))

        try {
            await updateVisit({ id: visit.id, data: visitData }).unwrap()

            for (const [index, item] of formServices.entries()) {
                if (!item.id) {
                    const created = await createVisitService({
                        visit_id: visit.id,
                        service_id: item.service_id,
                        quantity: item.quantity,
                        price_at_time: item.price_at_time,
                    }).unwrap()
                    setValue(`services.${index}.id`, created.id)
                }
            }

            for (const item of formServices) {
                if (item.id) {
                    await updateVisitService({
                        id: item.id,
                        data: {
                            service_id: item.service_id,
                            quantity: item.quantity,
                            price_at_time: item.price_at_time,
                        },
                    }).unwrap()
                }
            }

            for (const item of toDelete) {
                await deleteVisitService(item.id).unwrap()
            }

            onClose()
        } catch {
            // не закрываем — errorMiddleware покажет toast, пользователь повторит
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
                    <div className="mt-2 flex items-center justify-between">
                        <span className="font-medium">Услуги</span>
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => append({ service_id: '', quantity: 1, price_at_time: 0 })}
                            className="text-blue-500 cursor-pointer">
                            + добавить услугу
                        </button>
                    </div>

                    {getArrayError(errors.services) && (
                        <span className="text-red-500 text-sm">{getArrayError(errors.services)}</span>
                    )}

                    {isLoadingServices && (
                        <span className="text-neutral-500 text-sm">Загрузка услуг…</span>
                    )}

                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-[270px_40px_70px_10px] gap-2 items-start w-1/2">
                            <div className="flex flex-col gap-1">
                                <Controller
                                    name={`services.${index}.service_id`}
                                    control={control}
                                    render={({ field: f }) => (
                                        <Select
                                            {...f}
                                            showSearch
                                            optionFilterProp="label"
                                            placeholder="Услуга"
                                            className="w-full"
                                            options={services.map((s) => ({
                                                value: s.id,
                                                label: `${s.name}: ${Math.round(s.price)}₽`,
                                            }))}
                                            onChange={(value) => {
                                                f.onChange(value)
                                                const svc = services.find((s) => s.id === value)
                                                if (svc) {
                                                    setValue(
                                                        `services.${index}.price_at_time`,
                                                        Math.round(svc.price),
                                                    )
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
                                disabled={isSaving}
                                className="text-red-500 hover:text-red-700 p-2 flex items-center justify-center">
                                <DeleteOutlined />
                            </button>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={isSaving || isLoadingServices}
                        className="bg-blue-600 text-white rounded-md p-2 mt-4 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto">
                        {isSaving ? 'Сохранение...' : isLoadingServices ? 'Загрузка услуг...' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default VisitEditFormModal