import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { BrowserRouter } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AntdApp>
      <BrowserRouter>
        <StrictMode>
          <ConfigProvider locale={ruRU}>
            <App />
          </ConfigProvider>
        </StrictMode>
      </BrowserRouter>
    </AntdApp>
  </Provider>
)
