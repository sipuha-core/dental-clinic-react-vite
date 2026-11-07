import { useState } from 'react'
import { normalizeError } from '../../app/errors'
import { useGetPaymentsQuery } from '../../app/paymentApi'
import type { Payment, PaymentMethod, PaymentStatus } from '../../app/models/paymentTypes'
import EditButton from '../Buttons/EditButton'
import TableSkeletonRows from '../TableSkeletonRows'
import { formatDate } from '../../utils/formatDate'
import PaymentsFormModal from './PaymentsFormModal'

const methodMap: Record<PaymentMethod, string> = {
    cash: 'Наличные',
    card: 'Карта',
    transfer: 'Перевод',
    insurance: 'Страховка',
}

const statusMap: Record<PaymentStatus, string> = {
    pending: 'Ожидает',
    paid: 'Оплачен',
    failed: 'Ошибка',
    refunded: 'Возврат',
}

const PaymentsTable = () => {
    const { data: payments = [], isFetching, isError, error } = useGetPaymentsQuery()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingPayment, setEditingPayment] = useState<Payment | undefined>(undefined)

    const hasData = payments.length > 0
    const isLoadingFirst = isFetching && payments.length === 0
    const isEmpty = !isFetching && payments.length === 0
    const showFullError = isError && !hasData
    const showStaleWarning = isError && hasData

    if (showFullError) {
        const errorMessage = normalizeError(error) ?? 'Ошибка загрузки'
        return (
            <div className="mt-4 rounded-xl border bg-4 p-4 text-red-700">
                {errorMessage}
            </div>
        )
    }

    return (
        <>
            <div className="mt-4 w-full overflow-hidden rounded-xl border">
                <div className="flex items-center justify-between bg-4 px-4 py-3">
                    <div className="flex items-center gap-12">
                        <h2 className="text-lg font-medium">Платежи</h2>
                        {showStaleWarning && (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                Не удалось обновить данные
                            </p>
                        )}
                        <p className="text-sm text-neutral-500">
                            Количество платежей: {payments.length}
                        </p>
                    </div>
                    <button onClick={() => setIsCreateOpen(true)} className="text-blue-500 cursor-pointer">
                        добавить платёж
                    </button>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-1">
                            <th className="px-4 py-3 text-left">Запись</th>
                            <th className="px-4 py-3 text-left">Сумма</th>
                            <th className="px-4 py-3 text-left">Способ</th>
                            <th className="px-4 py-3 text-left">Статус</th>
                            <th className="px-4 py-3 text-left">Дата</th>
                            <th className="px-4 py-3 text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingFirst ? (
                            <TableSkeletonRows rows={6} cols={6} />
                        ) : isEmpty ? (
                            <tr className="border-t border-neutral-300 bg-4">
                                <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                                    Платежи пока не добавлены
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id} className="border-t border-neutral-300 bg-4">
                                    <td className="px-4 py-3">{payment.visit_id.slice(0, 8)}</td>
                                    <td className="px-4 py-3">{Math.round(Number(payment.amount))} ₽</td>
                                    <td className="px-4 py-3">
                                        {methodMap[payment.payment_method] ?? payment.payment_method}
                                    </td>
                                    <td className="px-4 py-3">
                                        {statusMap[payment.status] ?? payment.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatDate(payment.created_at, { withTime: true })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setEditingPayment(payment)} className="cursor-pointer">
                                            <EditButton />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PaymentsFormModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <PaymentsFormModal
                isOpen={!!editingPayment}
                payment={editingPayment}
                onClose={() => setEditingPayment(undefined)}
            />
        </>
    )
}

export default PaymentsTable