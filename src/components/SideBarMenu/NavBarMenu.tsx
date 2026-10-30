import { UserRoleLabels } from '../../app/models/userTypes'
import { useUser } from '../../utils/useUser'
import Buttons from './Buttons'

const NavBarMenu = () => {
    const { user } = useUser()
    const roleLabel = user ? UserRoleLabels[user.role] : 'Авторизация'
    return (
        <div className='z-1 w-72 flex flex-col px-2 bg-5 items-center gap-6 pt-9  top-0 left-0 h-screen'>
            <p className='text-2xl bg-4 px-6 py-3 rounded-xl '>
                {roleLabel}
            </p>
            <Buttons />
        </div>
    )
}

export default NavBarMenu