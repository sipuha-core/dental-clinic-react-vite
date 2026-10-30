import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <p className="text-6xl font-bold text-neutral-400">404</p>
            <p className="text-xl text-neutral-600">Страница не найдена</p>
            <Link to="/overview">
                <p className='text-quit-main hover:underline'>
                    Вернуться на главную
                </p>
            </Link>
        </div>
    )
}

export default NotFoundPage