import { normalizeError } from '../../app/errors'
import { useGetPatientsQuery } from '../../app/patientApi'
import type { Patient } from '../../app/models/patientTypes'
import { useCallback, useState } from 'react'
import SearchInput from '../SearchInput'
import TableSkeletonRows from '../TableSkeletonRows'
import { formatDate } from '../../utils/formatDate'
import { formatPhone } from '../../utils/formatPhone'
import EditButton from '../Buttons/EditButton'
import PatientFormModal from './PatientFormModal'

const PatientsTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPatient, setEditingPatient] = useState<Patient | undefined>()

    const openCreate = () => {
        setEditingPatient(undefined)
        setIsModalOpen(true)
    }
    const openEdit = (patient: Patient) => {
        setEditingPatient(patient)
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
        setEditingPatient(undefined)
    }
    const [apiSearch, setApiSearch] = useState('')

    const { currentData: patients = [], isFetching, isError, error } = useGetPatientsQuery({ search: apiSearch })
    const handleSearch = useCallback((value: string) => setApiSearch(value), [])

    const hasData = patients.length > 0
    const isLoadingFirst = isFetching && patients.length === 0
    const isEmpty = !isFetching && patients.length === 0

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
                <div className="relative">
                    <SearchInput
                        onSearch={handleSearch}
                        placeholder="Поиск по имени или телефону" />
                    {isFetching && (
                        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-100">
                            <div className="h-full animate-progress bg-blue-500" style={{ width: '30%' }} />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between bg-4 px-4 py-3">
                    <div className="flex items-center gap-12">
                        <h2 className="text-lg font-medium">Список пациентов</h2>
                        {showStaleWarning && (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                Не удалось обновить данные
                            </p>
                        )}
                    </div>
                    <div>
                        <button onClick={openCreate} className="text-blue-500 cursor-pointer">
                            добавить пациента
                        </button>
                    </div>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-1">
                            <th className="px-4 py-3 text-left">Имя</th>
                            <th className="px-4 py-3 text-left">Фамилия</th>
                            <th className="px-4 py-3 text-left">Телефон</th>
                            <th className="px-4 py-3 text-left">Дата рождения</th>
                            <th className="px-4 py-3 text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingFirst ? (
                            <TableSkeletonRows rows={6} cols={5} />
                        ) : isEmpty ? (
                            <tr className="border-t border-neutral-300 bg-4">
                                <td className="px-4 py-6 text-center text-neutral-500" colSpan={5}>
                                    {apiSearch === ''
                                        ? 'Пациенты пока не добавлены.'
                                        : 'Пациента с такими данными нет.'}
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id} className="border-t border-neutral-300 bg-4">
                                    <td className="px-4 py-3">{patient.first_name}</td>
                                    <td className="px-4 py-3">{patient.last_name}</td>
                                    <td className="px-4 py-3">{formatPhone(patient.phone)}</td>
                                    <td className="px-4 py-3">
                                        {formatDate(patient.birth_date, { withTime: false })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => openEdit(patient)}
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
            <PatientFormModal
                isOpen={isModalOpen}
                patient={editingPatient}
                onClose={closeModal}
            />
        </>
    )
}

export default PatientsTable
// import { useGetPatientsQuery } from '../../app/patientApi'
// import type { Patient } from '../../app/models/patientTypes'
// import { useCallback, useState } from 'react'
// import SearchInput from '../SearchInput'
// import TableSkeletonRows from '../TableSkeletonRows'
// import { formatDate } from '../../utils/formatDate'
// import { formatPhone } from '../../utils/formatPhone'
// import EditButton from '../Buttons/EditButton'
// import PatientFormModal from './PatientFormModal'

// const PatientsTable = () => {
//     const [isCreateOpen, setIsCreateOpen] = useState(false)
//     const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined)
//     const [apiSearch, setApiSearch] = useState('')

//     const { currentData: patients = [], isFetching, isError, error } = useGetPatientsQuery({ search: apiSearch })
//     const handleSearch = useCallback((value: string) => setApiSearch(value), [])

//     const hasData = patients.length > 0
//     const isLoadingFirst = isFetching && patients.length === 0
//     const isEmpty = !isFetching && patients.length === 0

//     const showFullError = isError && !hasData
//     const showStaleWarning = isError && hasData

//     if (showFullError) {
//         const errorMessage = normalizeError(error) ?? 'Ошибка загрузки'
//         return (
//             <div className="mt-4 rounded-xl border bg-4 p-4 text-red-700">
//                 {errorMessage}
//             </div>
//         )
//     }
//     return (
//         <>
//             <div className="mt-4 w-full overflow-hidden rounded-xl border">
//                 <div className="relative">
//                     <SearchInput onSearch={handleSearch} placeholder="Поиск по имени или телефону" />
//                     {isFetching && (
//                         <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-100">
//                             <div className="h-full animate-progress bg-blue-500" style={{ width: '30%' }} />
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex items-center justify-between bg-4 px-4 py-3">
//                     <div className="flex items-center gap-12">
//                         <h2 className="text-lg font-medium">Список пациентов</h2>
//                         {showStaleWarning && (
//                             <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
//                                 Не удалось обновить данные
//                             </p>
//                         )}
//                     </div>
//                     <div>
//                         <button onClick={() => setIsCreateOpen(true)} className="text-blue-500 cursor-pointer">
//                             добавить пациента
//                         </button>
//                     </div>
//                 </div>

//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="bg-1">
//                             <th className="px-4 py-3 text-left">Имя</th>
//                             <th className="px-4 py-3 text-left">Фамилия</th>
//                             <th className="px-4 py-3 text-left">Телефон</th>
//                             <th className="px-4 py-3 text-left">Дата рождения</th>
//                             <th className="px-4 py-3 text-left">Действия</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {isLoadingFirst ? (
//                             <TableSkeletonRows rows={6} cols={5} />
//                         ) : isEmpty ? (
//                             <tr className="border-t border-neutral-300 bg-4">
//                                 <td className="px-4 py-6 text-center text-neutral-500" colSpan={5}>
//                                     {apiSearch === ''
//                                         ? 'Пациенты пока не добавлены.'
//                                         : 'Пациента с такими данными нет.'}
//                                 </td>
//                             </tr>
//                         ) : (
//                             patients.map((patient) => (
//                                 <tr key={patient.id} className="border-t border-neutral-300 bg-4">
//                                     <td className="px-4 py-3">{patient.first_name}</td>
//                                     <td className="px-4 py-3">{patient.last_name}</td>
//                                     <td className="px-4 py-3">{formatPhone(patient.phone)}</td>
//                                     <td className="px-4 py-3">
//                                         {formatDate(patient.birth_date, { withTime: false })}
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <button
//                                             onClick={() => setEditingPatient(patient)}
//                                             className="cursor-pointer">
//                                             <EditButton />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <PatientFormModal
//                 isOpen={isCreateOpen}
//                 onClose={() => setIsCreateOpen(false)}
//             />
//             <PatientFormModal
//                 isOpen={!!editingPatient}
//                 patient={editingPatient}
//                 onClose={() => setEditingPatient(undefined)}
//             />
//         </>
//     )
// }

// export default PatientsTable