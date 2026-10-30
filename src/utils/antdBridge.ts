import type { App } from 'antd'

type MessageInstance = ReturnType<typeof App.useApp>['message']
type NotificationInstance = ReturnType<typeof App.useApp>['notification']

type AntdBridge = {
    message: MessageInstance | null
    notification: NotificationInstance | null
}

export const antdBridge: AntdBridge = {
    message: null,
    notification: null,
}