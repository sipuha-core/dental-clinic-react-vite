import { z } from 'zod'
import { createUserSchema } from '../../app/schemas/user.schema'
import { useCreateUserMutation } from '../../app/userApi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

type CreateInput = z.infer<typeof createUserSchema>;

type Props = {
    isOpen: boolean
    onClose: () => void
}

const UserCreateFormModal = ({ isOpen, onClose }: Props) => {
    const [createUser, { isLoading }] = useCreateUserMutation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateInput>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            role: createUserSchema.shape.role.options[0],
            password: '',
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset()
        }
    }, [isOpen, reset])

    if (!isOpen) return null

    const onSubmit = async (data: CreateInput) => {
        try {
            await createUser(data).unwrap()
            reset()
            onClose()
        } catch {
            // ошибка будет отработана через errorMiddleware
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Добавить сотрудника</h3>
                    <button onClick={onClose} className="scale-150 cursor-pointer">
                        <CloseCircleOutlined />
                    </button>
                </div>

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
                        placeholder="Новый пароль"
                        className="border p-2 rounded"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white rounded-md p-2 mt-2 cursor-pointer">
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UserCreateFormModal