import { UserAddOutlined } from '@ant-design/icons'
import { useGetPatientsQuery } from '../../app/patientApi'
import { useGetUsersQuery } from '../../app/userApi'
import { useGetVisitsQuery } from '../../app/visitApi'
import DonutChart from './DonutChart'
import { COLORS } from '../../utils/colors.ts'
import 'dayjs/locale/ru'
import dayjs from 'dayjs'

const OverviewCard = () => {
    const { data: patients = [] } = useGetPatientsQuery({ search: '' })
    const { data: users = [] } = useGetUsersQuery()
    const { data: visits = [] } = useGetVisitsQuery()
    const patientsCount = patients.length
    const newThisMonth = patients.filter(item => dayjs(item.created_at).isSame(dayjs(), 'month')).length
    const visitsToday = visits.filter(item => dayjs(item.start_time).isSame(dayjs(), 'day'))

    const doctors = users.filter((item) => item.role === 'doctor')
    const visitsByDoctorToday = doctors.map((doctor) => ({
        name: `${doctor.last_name} ${doctor.first_name[0]}.`,
        value: visitsToday.filter((item) => item.doctor_id === doctor.id).length,
    })).filter((item) => item.value > 0)

    return (
        <div>
            <div className="flex flex-row gap-4 overflow-x-hidden">
                <div className="bg-4 pr-10 rounded-xl border">
                    <p className="pt-6 pl-6 text-2xl">Количество пациентов</p>
                    <div className="pt-10 pl-6">
                        <p className="text-6xl">{patientsCount}</p>
                        <div className="text-success-main flex flex-row gap-2 items-center py-3">
                            <UserAddOutlined className="scale-150" />
                            <p className="text-md font-bold ">{newThisMonth} пациентов в этом месяце</p>
                        </div>
                    </div>
                </div>
                <div className="bg-4 pr-6 rounded-xl border">
                    <p className="pt-6 pl-6 text-2xl">Количество записей на сегодня</p>
                    <div className="pt-10 pl-6">
                        <p className="text-6xl">{visitsToday.length}</p>
                        <div className="flex flex-row gap-6 py-3">
                            <p className="text-md text-wait-main font-bold">
                                В ожидании: {visitsToday.filter((item) => item.status === 'scheduled' || item.status === 'in_progress').length}
                            </p>
                            <p className="text-md text-success-main font-bold">
                                Завершено: {visitsToday.filter((item) => item.status === 'completed').length}
                            </p>
                            <p className="text-md text-quit-main font-bold">
                                Отменено: {visitsToday.filter((item) => item.status === 'cancelled' || item.status === 'no_show').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-4 rounded-xl w-84 border">
                    <p className="text-2xl pt-6 pl-6">Записи врачей</p>
                    <div className="flex flex-row overflow-x-hidden overflow-y-hidden">
                        <DonutChart data={visitsByDoctorToday} />
                        <div className='text-md py-4 px-4'>
                            {visitsByDoctorToday.map((item, i) => (
                                <p key={item.name} style={{ color: COLORS[i % COLORS.length] }}>
                                    {item.name}: {item.value}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverviewCard