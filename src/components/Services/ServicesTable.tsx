import { useState } from 'react'
import { normalizeError } from '../../app/errors'
import { useGetServicesQuery } from '../../app/serviceApi'
import type { Service } from '../../app/models/serviceTypes'
import EditButton from '../Buttons/EditButton'
import TableSkeletonRows from '../TableSkeletonRows'
import ServiceFormModal from './ServiceFormModal'
import DeleteButton from '../Buttons/DeleteButton'

const ServicesTable = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | undefined>(undefined)
    const { data: services = [], isFetching, isError, error } = useGetServicesQuery()

    const hasData = services.length > 0
    const isLoadingFirst = isFetching && services.length === 0
    const isEmpty = !isFetching && services.length === 0

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
            <div className="w-full overflow-hidden rounded-xl border">
                <div className="flex items-center justify-between bg-4 px-4 py-3">
                    <div className="flex items-center gap-12">
                        <h2 className="text-lg font-medium">Услуги</h2>
                        {showStaleWarning && (<p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            Не удалось обновить данные
                        </p>)}
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="text-blue-500 cursor-pointer"
                    >
                        добавить услугу
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-1">
                            <th className="px-4 py-3 text-left">Название</th>
                            <th className="px-4 py-3 text-left">Код</th>
                            <th className="px-4 py-3 text-left">Цена</th>
                            <th className="px-4 py-3 text-left">Длительность</th>
                            <th className="px-4 py-3 text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingFirst ? (
                            <TableSkeletonRows rows={6} cols={5} />
                        ) : isEmpty ? (
                            <tr className="border-t border-neutral-300 bg-4">
                                <td className="px-4 py-6 text-center text-neutral-500" colSpan={5}>
                                    Услуги ещё не были добавлены
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id} className="border-t border-neutral-300 bg-4">
                                    <td className="px-4 py-3">{service.name}</td>
                                    <td className="px-4 py-3">{service.code ?? '—'}</td>
                                    <td className="px-4 py-3">{Math.round(service.price)} ₽</td>
                                    <td className="px-4 py-3">{service.duration} мин</td>
                                    <td className="flex flex-row gap-4 px-4 py-3">
                                        <button onClick={() => {
                                            setEditingService(service)
                                            setIsEditOpen(true)
                                        }}
                                            className="cursor-pointer">
                                            <EditButton />
                                        </button>
                                        <button onClick={() => {
                                            setEditingService(service)
                                            setIsEditOpen(true)
                                        }}
                                            className="cursor-pointer">
                                            <DeleteButton />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ServiceFormModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)} />
            <ServiceFormModal
                isOpen={isEditOpen}
                service={editingService}
                onClose={() => {
                    setIsEditOpen(false)
                    setEditingService(undefined)
                }} />
        </>
    )
}

export default ServicesTable