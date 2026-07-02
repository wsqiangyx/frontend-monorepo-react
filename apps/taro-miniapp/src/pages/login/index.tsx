import { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { login } from '@/stores/auth'
import { ROUTES } from '@/constants/routes'
import './index.scss'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      await login(username, password)
      Taro.redirectTo({ url: ROUTES.HOME })
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="login">
      <Text className="login-title">中后台平台</Text>
      {error && <Text className="login-error">{error}</Text>}
      <Input
        className="login-input"
        placeholder="用户名"
        value={username}
        onInput={(e) => setUsername(e.detail.value)}
      />
      <Input
        className="login-input"
        type="password"
        placeholder="密码"
        value={password}
        onInput={(e) => setPassword(e.detail.value)}
      />
      <Button className="login-btn" onClick={handleSubmit} loading={loading}>
        登录
      </Button>
    </View>
  )
}
