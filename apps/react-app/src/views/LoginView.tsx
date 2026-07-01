import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/platform'
import { ROUTES } from '@/constants/routes'

export default function LoginView() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ username, password })
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="login-view">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error ? <p className="login-error">{error}</p> : null}
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
