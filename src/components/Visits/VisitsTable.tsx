import type { Visit, VisitStatus } from "../../app/models/visitTypes"
import { useState } from "react"
import { formatDate } from "../../utils/formatDate"
import EditButton from "../Buttons/EditButton"
import { useGetVisitsQuery } from "../../app/visitApi"
import { normalizeError } from "../../app/errors"
import TableSkeletonRows from "../TableSkeletonRows"
import VisitCreateFromModal from "./VisitCreateFromModal"
import VisitEditFormModal from "./VisitEditFormModal"

const statusMap: Record<VisitStatus, string> = {
    scheduled: "Запланирован",
    in_progress: "В процессе",
    completed: "Завершен",
    cancelled: "Отменен",
    no_show: "Не явился",
}

const VisitsTable = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingVisit, setEditingVisit] = useState<Visit | null>(null)
    const { data: visits = [], isFetching, isError, error } = useGetVisitsQuery()

    const hasData = visits.length > 0
    const isLoadingFirst = isFetching && visits.length === 0
    const isEmpty = !isFetching && visits.length === 0

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
                        <h2 className="text-lg font-medium">Записи</h2>
                        {showStaleWarning && (<p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            Не удалось обновить данные
                        </p>)}
                        <p className="text-sm text-neutral-500">
                            Количество записей: {visits.length}
                        </p>
                    </div>
                    <button
                        onClick={() => { setIsCreateOpen(true) }}
                        className="text-blue-500 cursor-pointer">
                        добавить запись
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-1">
                            <th className="px-4 py-3 text-left">Пациент</th>
                            <th className="px-4 py-3 text-left">Врач</th>
                            <th className="px-4 py-3 text-left">Начало</th>
                            <th className="px-4 py-3 text-left">Конец</th>
                            <th className="px-4 py-3 text-left">Статус</th>
                            <th className="px-4 py-3 text-left">Изменить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingFirst ? (
                            <TableSkeletonRows rows={6} cols={6} />
                        ) : isEmpty ? (
                            <tr className="border-t border-neutral-300 bg-4">
                                <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                                    Записи ещё не были добавлены
                                </td>
                            </tr>
                        ) : (
                            visits.map((visit) => (
                                <tr key={visit.id} className="border-t border-neutral-300 bg-4">
                                    <td className="px-4 py-3">{visit.patient_first_name} {visit.patient_last_name}</td>
                                    <td className="px-4 py-3">
                                        {visit.doctor_id ? `${visit.doctor_first_name} ${visit.doctor_last_name}` : '—'}
                                    </td>
                                    <td className="px-4 py-3">{formatDate(visit.start_time, { withTime: true })}</td>
                                    <td className="px-4 py-3">{formatDate(visit.end_time, { withTime: true })}</td>
                                    <td className="px-4 py-3">{statusMap[visit.status]}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setEditingVisit(visit)}
                                            className="cursor-pointer">
                                            <EditButton />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>
            <VisitCreateFromModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <VisitEditFormModal
                visit={editingVisit}
                onClose={() => setEditingVisit(null)}
            />
        </>
    )
}

export default VisitsTable