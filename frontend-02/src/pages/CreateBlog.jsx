import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApiClient from '../api/client'

function CreateBlog() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!ApiClient.isAuthenticated()) {
            alert('You must be logged in to access this page.')
            navigate('/login')
        }
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !content.trim()) {
            setError('Please fill in all required fields.')
            return
        }

        const blogData = {
            title: title.trim(),
            content: content.trim(),
            status: isActive ? 'active' : 'inactive'
        }

        try {
            await ApiClient.blogs.create(blogData)
            navigate('/blogs')
        } catch (err) {
            setError(`Failed to save blog: ${err.message}`)
        }
    }

    return (
        <>
            <Navbar />

            <main className="container">
                <div className="form-container">
                    <h1>Create New Blog</h1>
                    <form id="blogForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content *</label>
                            <textarea
                                id="content"
                                rows="10"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                                <span>Active</span>
                            </label>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Create Blog</button>
                            <Link to="/blogs" className="btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default CreateBlog
