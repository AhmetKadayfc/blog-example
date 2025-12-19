import { Link } from 'react-router-dom'
import ApiClient from '../api/client'

function Navbar() {
    const isAuthenticated = ApiClient.isAuthenticated()

    const handleLogout = () => {
        ApiClient.auth.logout()
        window.location.reload()
    }

    return (
        <nav className="simple-nav">
            <div className="nav-container">
                <Link to="/" className="nav-brand">Blog</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/blogs">All Blogs</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/create">Create Blog</Link>
                            <a href="#" onClick={handleLogout}>Logout</a>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
