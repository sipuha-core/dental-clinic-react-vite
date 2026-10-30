import { App } from 'antd'
import { useEffect } from 'react'
import { antdBridge } from '../utils/antdBridge'

const AntdBridge = () => {
    const { message, notification } = App.useApp()

    useEffect(() => {
        antdBridge.message = message
        antdBridge.notification = notification
    }, [message, notification])

    return null
}

export default AntdBridge