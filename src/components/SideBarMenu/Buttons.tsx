import React from 'react'
import {
    BookOutlined,
    BookFilled,
    DollarCircleOutlined,
    DollarCircleFilled,
    EyeOutlined,
    EyeFilled,
    ThunderboltOutlined,
    ThunderboltFilled,
    TeamOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import ENDPOINTS from '../../app/endpoints'

const items = [
    {
        key: '/',
        outline: <EyeOutlined className="text-2xl" />,
        filled: <EyeFilled className="text-2xl" />,
        label: 'Обзор',
    },
    {
        key: ENDPOINTS.VISITS,
        outline: <OrderedListOutlined className="text-2xl" />,
        filled: <UnorderedListOutlined className="text-2xl" />,
        label: 'Записи',
    },
    {
        key: ENDPOINTS.PATIENTS,
        outline: <BookOutlined className="text-2xl" />,
        filled: <BookFilled className="text-2xl" />,
        label: 'Список пациентов',
    },
    {
        key: ENDPOINTS.SERVICES,
        outline: <ThunderboltOutlined className="text-2xl" />,
        filled: <ThunderboltFilled className="text-2xl" />,
        label: 'Услуги',
    },
    {
        key: ENDPOINTS.PAYMENTS,
        outline: <DollarCircleOutlined className="text-2xl" />,
        filled: <DollarCircleFilled className="text-2xl" />,
        label: 'Платежи',
    },
    {
        key: ENDPOINTS.USERS,
        outline: <TeamOutlined className="text-2xl" />,
        filled: <TeamOutlined className="text-2xl" />,
        label: 'Персонал',
    }
]

const Buttons: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <div className="w-full bg-(--color-2) rounded-lg p-2 font-mono">
            {items.map((item) => {
                const isActive = currentPath === item.key
                return (
                    <div
                        key={item.key}
                        onClick={() => navigate(item.key)}
                        className={`flex items-center gap-3 p-3 rounded cursor-pointer text-lg
              ${isActive ? 'bg-(--color-3) text-black' : 'hover:bg-blue-200'}`} >
                        {isActive ? item.filled : item.outline}
                        <span>{item.label}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default Buttons
