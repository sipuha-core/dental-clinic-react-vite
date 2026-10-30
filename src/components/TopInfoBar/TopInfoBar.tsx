import { useMemo } from 'react'
import ExitButton from '../Buttons/ExitButton'
import { useUser } from '../../utils/useUser'

const pageNameMap: Record<string, string> = {
  overview: 'Обзор',
  patients: 'Пациенты',
  services: 'Услуги',
  payments: 'Платежи',
  staff: 'Персонал',
  visits: 'Записи',
  login: 'Авторизация'
}

type Props = {
  name: string
}

const TopInfoBar = ({ name }: Props) => {
  const { fullName } = useUser()
  const pageName = pageNameMap[name] ?? 'Панель'
  const date = useMemo(
    () =>
      new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [],
  )

  return (
    <div className="fixed flex top-0 right-0 h-18 w-312 items-center justify-between bg-neutral-100 px-9 py-4">
      <p className="text-3xl text-neutral-600">{pageName}</p>
      <p className="text-xl text-neutral-700">{date}</p>
      <div className="flex flex-row items-center gap-9">
        <p className="rounded-lg bg-2 p-2 text-xl text-neutral-700">
          {fullName || 'Требуется авторизация'}
        </p>
        <ExitButton />
      </div>
    </div>
  )
}

export default TopInfoBar
