import { useMemo } from 'react'
import type { UserRole } from '../app/models/userTypes'

interface UserData {
    id: string
    first_name: string
    last_name: string
    email: string
    role: UserRole
}

export function useUser() {
    const user = useMemo<UserData | null>(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return null
        try {
            return JSON.parse(stored)
        } catch {
            // ошибка будет обработана через errorMiddleware
        }
    }, [])

    const fullName = user ? `${user.first_name} ${user.last_name}` : ''

    return { user, fullName }
}