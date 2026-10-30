import type { User, UserRole } from '../../app/models/userTypes'
import { useGetUsersQuery } from '../../app/userApi'
import { formatDate } from '../../utils/formatDate'
import { formatPhone } from '../../utils/formatPhone'
import { useState } from 'react'
import UserCreateFormModal from './UserCreateFormModal'
import UserUpdateFormModal from './UserUpdateFromModal'
import DeleteButton from '../Buttons/DeleteButton'
import EditButton from '../Buttons/EditButton'

const roleMap: Record<UserRole, string> = {
  admin: 'Администратор',
  doctor: 'Врач',
  assistant: 'Ассистент',
}

const UsersTable = () => {
  const { data: users = [], isLoading, isFetching, isError } = useGetUsersQuery()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User>()

  if (isLoading) return <div className="rounded-xl border bg-4 p-4">Загрузка персонала...</div>
  if (isError) return <div className="rounded-xl border bg-4 p-4 text-red-700">Не удалось загрузить персонал.</div>

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between bg-4 px-4 py-3">
          <div className='flex items-center gap-12'>
            <h2 className="text-lg font-medium">Персонал</h2>
            <p className="text-sm text-neutral-500">
              Количество сотрудников: {isFetching ? 'Обновление...' : `${users.length}`}
            </p>
          </div>
          <button onClick={() => setIsCreateOpen(true)}
            className="text-blue-500 cursor-pointer">
            добавить сотрудника
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-1">
              <th className="px-4 py-3 text-left">Имя</th>
              <th className="px-4 py-3 text-left">Фамилия</th>
              <th className="px-4 py-3 text-left">Роль</th>
              <th className="px-4 py-3 text-left">Телефон</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Добавлен</th>
              <th className="px-4 py-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-neutral-300 bg-4">
                <td className="px-4 py-3">{user.first_name}</td>
                <td className="px-4 py-3">{user.last_name}</td>
                <td className="px-4 py-3">{roleMap[user.role] ?? user.role}</td>
                <td className="px-4 py-3">{formatPhone(user.phone ?? '')}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{formatDate(user.created_at, { withTime: false })}</td>
                <td className="flex flex-row gap-4 px-4 py-3">
                  <button onClick={() => {
                    setEditingUser(user)
                    setIsUpdateOpen(true)
                  }}><EditButton /></button>
                  <DeleteButton />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr className="border-t border-neutral-300 bg-4">
                <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                  Сотрудники пока не добавлены.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserCreateFormModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
        }}
      />
      <UserUpdateFormModal
        isOpen={isUpdateOpen}
        user={editingUser}
        onClose={() => {
          setIsUpdateOpen(false)
          setEditingUser(undefined)
        }}
      />
    </>
  )
}

export default UsersTable
