import { Form, Input, Button, Card, message } from 'antd'
import { useLoginMutation } from '../app/userApi'

export default function LoginPage() {
    const [login, { isLoading }] = useLoginMutation()

    const onFinish = async (values: { email: string, password: string }) => {
        try {
            const result = await login(values).unwrap()
            localStorage.setItem('token', result.token)
            localStorage.setItem('user', JSON.stringify(result.user))
            message.success('Вход выполнен')
            window.location.href = '/'
        } catch {
            // ошибка будет отработана через errorMiddleware
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card title="Вход в систему" style={{ width: 400 }}>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}