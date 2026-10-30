import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createServiceSchema } from '../../app/schemas/service.schema'
import type { Service } from '../../app/models/serviceTypes'
import { useCreateServiceMutation, useUpdateServiceMutation } from '../../app/serviceApi'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'

type CreateInput = z.infer<typeof createServiceSchema>
type Props = {
    isOpen: boolean,
    service?: Service,
    onClose: () => void
}

const ServiceFormModal = ({ isOpen, service, onClose }: Props) => {
    const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()
    const isSaving = isCreating || isUpdating

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateInput>({
        resolver: zodResolver(createServiceSchema),
        defaultValues: {
            name: '',
            description: '',
            code: '',
            price: 0,
            duration: 0
        }
    })

    useEffect(() => {
        if (!isOpen) return
        if (service) {
            reset({
                name: service.name,
                description: service.description ?? '',
                code: service.code ?? '',
                price: service.price,
                duration: service.duration
            })
        }
        else {
            reset({
                name: '',
                description: '',
                code: '',
                price: 0,
                duration: 0
            })
        }
    }, [isOpen, reset, service])

    if (!isOpen) return null

    const onSubmit = async (data: CreateInput) => {
        try {
            data = {
                ...data,
                price: Math.round(data.price),
                description: data.description?.trim() === '' ? null : data.description,
                code: data.code?.trim() === '' ? null : data.code
            }
            if (service) await updateService({ id: service.id, data }).unwrap()
            else await createService(data).unwrap()
            onClose()
        } catch {
            // ошибка будет обработана через errorMiddleware
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        {service ? 'Редактировать услугу' : 'Добавить услугу'}
                    </h3>
                    <button onClick={onClose} className="scale-150 cursor-pointer">
                        <CloseCircleOutlined />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <input {...register('name')} placeholder="Название" className="border p-2 rounded" />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}

                    <input {...register('description')} placeholder="Описание" className="border p-2 rounded" />
                    {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}

                    <input {...register('code')} placeholder="Код" className="border p-2 rounded" />
                    {errors.code && <span className="text-red-500 text-sm">{errors.code.message}</span>}

                    <input {...register('price', { valueAsNumber: true })} placeholder="Цена" className="border p-2 rounded" />
                    {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}

                    <input {...register('duration', { valueAsNumber: true })} placeholder="Длительность (в минутах)" className="border p-2 rounded" />
                    {errors.duration && <span className="text-red-500 text-sm">{errors.duration.message}</span>}


                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-md p-2 mt-2 cursor-pointer">
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ServiceFormModal