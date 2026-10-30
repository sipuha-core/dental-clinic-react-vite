export type UserRole = 'admin' | 'doctor' | 'assistant'

export const UserRoleLabels: Record<UserRole, string> = {
  admin: 'Администратор',
  doctor: 'Врач',
  assistant: 'Ассистент',
}
export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: UserRole
  }
}
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserDto {
  first_name: string
  last_name: string
  email: string
  phone: string | null
  password: string
  role: UserRole
}

export interface UpdateUserDto {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
  role?: UserRole
  is_active?: boolean
  password?: string
}
