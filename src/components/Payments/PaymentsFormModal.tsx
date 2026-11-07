import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPaymentSchema } from '../../app/schemas/payment.schema'
import type { Payment, PaymentMethod, PaymentStatus } from '../../app/models/paymentTypes'
import { useCreatePaymentMutation, useUpdatePaymentMutation } from '../../app/paymentApi'
import { useGetVisitsQuery } from '../../app/visitApi'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { formatDate } from '../../utils/formatDate'

type CreatePaymentInput = z.infer<typeof createPaymentSchema>

type Props = {
    isOpen: boolean
    payment?: Payment
    onClose: () => void
}

const methodOptions: { value: PaymentMethod; label: string }[] = [
    { value: 'cash', label: 'Наличные' },
    { value: 'card', label: 'Карта' },
    { value: 'transfer', label: 'Перевод' },
    { value: 'insurance', label: 'Страховка' },
]

const statusOptions: { value: PaymentStatus; label: string }[] = [
    { value: 'pending', label: 'Ожидает' },
    { value: 'paid', label: 'Оплачен' },
    { value: 'failed', label: 'Ошибка' },
    { value: 'refunded', label: 'Возврат' },
]

const PaymentFormModal = ({ isOpen, payment, onClose }: Props) => {
    const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation()
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation()
    const isSaving = isCreating || isUpdating

    const { data: visits = [] } = useGetVisitsQuery()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreatePaymentInput>({
        resolver: zodResolver(createPaymentSchema),
        defaultValues: {
            payment_method: 'cash',
            status: 'pending',
        },
    })

    useEffect(() => {
        if (!isOpen) return

        if (payment) {
            reset({
                visit_id: payment.visit_id,
                amount: Number(payment.amount),
                payment_method: payment.payment_method,
                status: payment.status,
            })
        } else {
            reset({ payment_method: 'cash', status: 'pending' })
        }
    }, [isOpen, payment, reset])

    if (!isOpen) return null

    const onSubmit = async (data: CreatePaymentInput) => {
        try {
            if (payment) await updatePayment({ id: payment.id, data }).unwrap()
            else await createPayment(data).unwrap()

            reset()
            onClose()
        } catch {
            // ошибка будет обработана через errorMiddleware
        }
    }

    const visitOptions = visits.map((v) => ({
        value: v.id,
        label: `${v.patient_first_name} ${v.patient_last_name} — ${formatDate(v.start_time, { withTime: true })}`,
    }))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        {payment ? 'Редактировать платёж' : 'Добавить платёж'}
                    </h3>
                    <button type="button" onClick={onClose} className="scale-150 cursor-pointer">
                        <CloseCircleOutlined />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="visit_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    showSearch
                                    optionFilterProp="label"
                                    options={visitOptions}
                                    placeholder="Запись"
                                    className="w-full"
                                />
                            )} />
                        {errors.visit_id && (
                            <span className="text-red-500 text-sm">{errors.visit_id.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <input
                            {...register('amount', { valueAsNumber: true })}
                            type="number"
                            step="any"
                            min={0}
                            placeholder="Сумма, ₽"
                            className="border p-2 rounded" />
                        {errors.amount && (
                            <span className="text-red-500 text-sm">{errors.amount.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Controller
                            name="payment_method"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={methodOptions}
                                    placeholder="Способ оплаты"
                                    className="w-full"
                                />
                            )} />
                        {errors.payment_method && (
                            <span className="text-red-500 text-sm">{errors.payment_method.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={statusOptions}
                                    placeholder="Статус"
                                    className="w-full"
                                />
                            )} />
                        {errors.status && (
                            <span className="text-red-500 text-sm">{errors.status.message}</span>
                        )}
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md bg-neutral-200 p-2 text-neutral-800 cursor-pointer hover:bg-neutral-300">
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 rounded-md bg-blue-600 p-2 text-white cursor-pointer hover:bg-blue-700 disabled:opacity-50">
                            {isSaving ? 'Сохранение...' : payment ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PaymentFormModal