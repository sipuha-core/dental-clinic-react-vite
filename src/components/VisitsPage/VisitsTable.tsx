import type { Visit, VisitStatus } from "../../app/models/visitTypes"
import { useState } from "react"
import { formatDate } from "../../utils/formatDate"
import EditButton from "../Buttons/EditButton"
import EditVisitModal from "./EditVisitModal"

type Props = {
    visits?: Visit[]
    isLoading?: boolean
    isError?: boolean
}

const statusMap: Record<VisitStatus, string> = {
    scheduled: "Запланирован",
    in_progress: "В процессе",
    completed: "Завершен",
    cancelled: "Отменен",
    no_show: "Не явился",
}

const VisitsTable = ({ visits = [], isLoading, isError }: Props) => {
    const [editingVisit, setEditingVisit] = useState<Visit | null>(null)

    if (isLoading) return <div className="mt-4 rounded-xl border bg-4 p-4">Загрузка визитов...</div>
    if (isError) return <div className="mt-4 rounded-xl border bg-4 p-4 text-red-700">Не удалось загрузить визиты.</div>

    return (
        <>
            <div className="mt-4 w-full overflow-hidden rounded-xl border">
                <div className="flex items-center justify-between bg-4 px-4 py-3">
                    <div className="flex items-center gap-12">
                        <h2 className="text-lg font-medium">Визиты</h2>
                        <p className="text-sm text-neutral-500">
                            Количество визитов: {visits.length}
                        </p>
                    </div>
                    <button
                        onClick={() => { }}
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
                        {visits.map((visit) => (
                            <tr key={visit.id} className="border-t border-neutral-300 bg-4">
                                <td className="px-4 py-3">{visit.patient_first_name} {visit.patient_last_name}</td>
                                <td className="px-4 py-3">{visit.doctor_first_name} {visit.doctor_last_name}</td>
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
                        ))}
                        {visits.length === 0 && (
                            <tr className="border-t border-neutral-300 bg-4">
                                <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                                    Визиты пока не добавлены.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {editingVisit && (
                <EditVisitModal
                    visit={editingVisit}
                    onClose={() => setEditingVisit(null)}
                />
            )}
        </>
    )
}

export default VisitsTable