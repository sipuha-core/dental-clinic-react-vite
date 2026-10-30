import { Link } from 'react-router-dom'
import { useGetVisitsQuery } from '../../app/visitApi'
import { formatDate } from '../../utils/formatDate'
import dayjs from 'dayjs'
import type { VisitStatus } from '../../app/models/visitTypes'

const statusClasses: Record<VisitStatus, string> = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-neutral-200 text-neutral-800',
}

const statusLabels: Record<VisitStatus, string> = {
    scheduled: 'Запланирован',
    in_progress: 'В процессе',
    completed: 'Завершён',
    cancelled: 'Отменён',
    no_show: 'Не явился',
}

const AppointmentsTable = () => {
    const { data: visits = [], isFetching } = useGetVisitsQuery()

    const upcoming = visits
        .filter((v) => v.status === 'scheduled' || v.status === 'in_progress')
        .filter((v) => dayjs(v.start_time).isAfter(dayjs().startOf('day')))
        .sort((a, b) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf())
        .slice(0, 5)

    if (isFetching && upcoming.length === 0) {
        return (
            <div className="rounded-xl border w-[70%] mt-4 p-8 text-center text-neutral-500">
                Загрузка...
            </div>
        )
    }

    if (upcoming.length === 0) {
        return (
            <div className="rounded-xl border w-[70%] mt-4 p-8 text-center text-neutral-500">
                Ближайших записей нет
            </div>
        )
    }

    return (
        <div className="rounded-xl overflow-hidden border w-[70%] mt-4">
            <div className="flex justify-between items-center px-4 py-3 bg-4">
                <h2 className="text-lg font-medium">Ближайшие записи</h2>
                <Link to="/visits" className="text-blue-500 cursor-pointer">
                    посмотреть все
                </Link>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-1">
                        <th className="px-4 py-3 text-left">Пациент</th>
                        <th className="px-4 py-3 text-left">Врач</th>
                        <th className="px-4 py-3 text-left">Время</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {upcoming.map((v) => (
                        <tr key={v.id} className="border-t border-neutral-300 bg-4">
                            <td className="px-4 py-3">
                                {v.patient_first_name} {v.patient_last_name}
                            </td>
                            <td className="px-4 py-3">
                                {v.doctor_first_name && v.doctor_last_name
                                    ? `${v.doctor_first_name} ${v.doctor_last_name}`
                                    : '—'}
                            </td>
                            <td className="px-4 py-3">
                                {formatDate(v.start_time, { withTime: true })}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded ${statusClasses[v.status]}`}
                                >
                                    {statusLabels[v.status]}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AppointmentsTable