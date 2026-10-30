import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '../../app/models/userTypes'
import { z } from 'zod'
import { updateUserSchema } from '../../app/schemas/user.schema'
import { useUpdateUserMutation } from '../../app/userApi'

type UpdateUserFormValues = z.infer<typeof updateUserSchema>

type Props = {
    isOpen: boolean
    onClose: () => void
    user?: User
}

const UserUpdateFormModal = ({ isOpen, onClose, user }: Props) => {
    const [updateUser] = useUpdateUserMutation()
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
    })

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                is_active: user.is_active,
            })
        }
    }, [user, reset])


    const onSubmit = (data: UpdateUserFormValues) => {
        if (!user) return
        const payload: UpdateUserFormValues = { ...data }
        if (!payload.password) {
            delete payload.password
        }
        updateUser({ id: user.id, data })
            .unwrap()
            .then(() => onClose())
            .catch(() => { })
    }

    if (!isOpen || !user) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <h2 className="mb-4 text-lg font-medium">Редактировать сотрудника</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <input {...register('first_name')} placeholder="Имя" className="border p-2 rounded" />
                    {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name.message}</span>}

                    <input {...register('last_name')} placeholder="Фамилия" className="border p-2 rounded" />
                    {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name.message}</span>}

                    <input {...register('email')} placeholder="Email" className="border p-2 rounded" />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

                    <input {...register('phone')} placeholder="Телефон" className="border p-2 rounded" />
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}

                    <select {...register('role')} className="border p-2 rounded">
                        <option value="admin">Администратор</option>
                        <option value="doctor">Врач</option>
                        <option value="assistant">Ассистент</option>
                    </select>

                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Новый пароль (необязательно)"
                        className="border p-2 rounded"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-neutral-500 text-white rounded-md p-2">
                            Отмена
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-md p-2">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserUpdateFormModal