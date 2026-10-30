import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NavBarMenu from './components/SideBarMenu/NavBarMenu'
import TopInfoBar from './components/TopInfoBar/TopInfoBar'
import AntdBridge from './components/AntdBridge'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RouteProtect from './components/RouteProtect'

const OverviewPage = lazy(() => import('./pages/OverviewPage'))
const PatientsPage = lazy(() => import('./pages/PatientsPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const VisitsPage = lazy(() => import('./pages/VisitsPage'))

function App() {
  const location = useLocation()
  const pageKey = location.pathname.split('/')[1] || 'overview'

  return (
    <div>
      <div className="fixed z-50 left-0 top-0 w-full h-20 flex">
        <NavBarMenu />
        <AntdBridge />
        <TopInfoBar name={pageKey} />
      </div>

      <div className="ml-84 mt-30 mr-2">
        <Suspense fallback={<div className="p-4">Загрузка страницы...</div>}>
          <Routes>
            <Route path='/login' element={<LoginPage />} />

            <Route element={<RouteProtect />}>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/visits" element={<VisitsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
