type FormatDateOptions = {
    withTime?: boolean
}

export const formatDate = (
    date: string | null | undefined,
    { withTime = true }: FormatDateOptions = {}
) => {
    if (!date) return '—'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(withTime && { hour: '2-digit', minute: '2-digit' }),
    }).format(d)
}