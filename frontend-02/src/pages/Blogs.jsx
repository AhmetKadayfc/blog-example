import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApiClient from '../api/client'

function Blogs() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        loadBlogs()
    }, [])

    const loadBlogs = async () => {
        try {
            const response = await ApiClient.blogs.getAll()
            setBlogs(response || [])
            setLoading(false)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await ApiClient.blogs.delete(id)
                loadBlogs()
            } catch (err) {
                alert(`Failed to delete blog: ${err.message}`)
            }
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const truncate = (text, maxLength) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const isOwner = (blog) => {
        const currentUserId = ApiClient.getUserId()
        return currentUserId && String(blog.author.id) === String(currentUserId)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                <div className="page-header">
                    <h1>All Blogs</h1>
                    {ApiClient.isAuthenticated() && (
                        <button className="btn-primary" onClick={() => navigate('/create')}>
                            Create New Blog
                        </button>
                    )}
                </div>

                <div className="blogs-list">
                    {loading ? (
                        <p className="loading">Loading blogs...</p>
                    ) : error ? (
                        <p className="error-message">Failed to load blogs: {error}</p>
                    ) : blogs.length === 0 ? (
                        <p className="no-data">No blogs found.</p>
                    ) : (
                        blogs.map(blog => (
                            <article key={blog.id} className="blog-item">
                                <div className="blog-item-content">
                                    <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h2 className="blog-item-title">{blog.title}</h2>
                                    </Link>
                                    <p className="blog-item-date">{formatDate(blog.created_at)}</p>
                                    <p className="blog-item-excerpt">{truncate(blog.content, 150)}</p>
                                    <span className={`blog-status ${blog.status}`}>
                                        {blog.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                {isOwner(blog) && (
                                    <div className="blog-item-actions">
                                        <button className="btn-edit" onClick={() => navigate(`/edit/${blog.id}`)}>
                                            Edit
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(blog.id)}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))
                    )}
                </div>
            </main>
        </>
    )
}

export default Blogs
