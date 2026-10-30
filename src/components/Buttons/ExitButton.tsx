import React from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';

const ExitButton: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    window.location.reload()
  };
  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer relative inline-flex items-center p-3 text-white text-lg font-medium rounded-lg overflow-hidden group">
      <span className="absolute inset-0 bg-linear-to-br from-[#4A6E9D] to-[#2d92ff] transition-all duration-300 group-hover:opacity-50 rounded-lg"></span>
      <span className="relative flex items-center gap-2">
        <LogoutOutlined />
      </span>
    </button>
  )
}

export default ExitButton
