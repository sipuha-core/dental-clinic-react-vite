import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit'
import { normalizeError } from './errors'
import { antdBridge } from '../utils/antdBridge'

const recentErrors = new Set<string>()
const DEDUPLICATION_TIME = 3000

export const errorMiddleware: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const arg = action.meta?.arg as { type?: string } | undefined
        const isMutation = arg?.type === 'mutation'
        if (isMutation) {
            const message = normalizeError(action.payload)
            if (message && !recentErrors.has(message)) {
                recentErrors.add(message)
                antdBridge.message?.error(message)

                setTimeout(() => {
                    recentErrors.delete(message)
                }, DEDUPLICATION_TIME)
            }
        }
    }

    return next(action)
}