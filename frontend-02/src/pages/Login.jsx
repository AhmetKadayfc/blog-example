import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ApiClient from '../api/client'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            await ApiClient.auth.login(email, password)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Login</h1>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary">Login</button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

                <p className="auth-link">
                    <Link to="/">← Back to Home</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
