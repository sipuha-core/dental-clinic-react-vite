export type FiltersState = {
    search: string,
    status: 'all' | 'active' | 'archived',
    page: number
}

export type FiltersAction =
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SET_STATUS'; payload: 'all' | 'active' | 'archived' }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'RESET' }

export const initialFilters: FiltersState = {
    search: '',
    status: 'all',
    page: 1
}

export function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, search: action.payload, page: 1 }
        case 'SET_STATUS':
            return { ...state, status: action.payload, page: 1 }
        case 'SET_PAGE':
            return { ...state, page: action.payload }
        case 'RESET':
            return { ...initialFilters }
        default: {
            const _exhaustive: never = action
            throw new Error(`Unhandled action type: ${(_exhaustive as { type: string }).type}`)
        }
    }
}