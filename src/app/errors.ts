import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error !== null && 'status' in error
}

function extractServerMessage(data: unknown): string | null {
    if (typeof data !== 'object' || data === null) return null

    if ('errors' in data) {
        if (typeof data.errors === 'string') return data.errors
        if (Array.isArray(data.errors)) {
            return data.errors.map((item) => typeof item === 'string' ? item : JSON.stringify(item)).join(', ')
        }
    }
    if ('message' in data && typeof data.message === 'string') {
        return data.message
    }

    return null
}

function mapHttpStatus(status: number): string {
    switch (status) {
        case 400: return 'Неверный запрос'
        case 401: return 'Требуется авторизация'
        case 403: return 'Нет доступа'
        case 404: return 'Не найдено'
        case 409: return 'Конфликт данных'
        default:
            return status >= 500
                ? 'Ошибка сервера. Попробуйте позже'
                : `Произошла ошибка (код ${status})`
    }
}

function normalizeFetchError(error: FetchBaseQueryError): string | null {
    if (typeof error.status === 'number') {
        return extractServerMessage(error.data) ?? mapHttpStatus(error.status)
    }
    switch (error.status) {
        case 'FETCH_ERROR':
            return typeof error.error === 'string' && error.error.includes('Abort')
                ? null : 'Не удалось соединиться с сервером'
        case 'TIMEOUT_ERROR':
            return 'Превышено время ожидания'

        case 'PARSING_ERROR':
            return 'Некорректный ответ сервера'

        case 'CUSTOM_ERROR':
            return typeof error.error === 'string' ? error.error : 'Произошла ошибка'

        default: {
            return 'Произошла неизвестная ошибка'
        }

    }
}

function hasMessage(error: unknown): error is { message: string } {
    return (typeof error === 'object'
        && error !== null
        && 'message' in error
        && typeof error.message === 'string'
    )
}

export function normalizeError(error: unknown): string | null {
    if (isFetchBaseQueryError(error)) return normalizeFetchError(error)
    if (hasMessage(error)) return error.message
    return 'Произошла неизвестная ошибка'
}