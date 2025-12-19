import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApiClient from '../api/client'
import { Link } from 'react-router-dom'

function BlogDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadBlogDetail()
    }, [id])

    const loadBlogDetail = async () => {
        try {
            const data = await ApiClient.blogs.getById(id)
            setBlog(data)
            setLoading(false)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await ApiClient.blogs.delete(id)
                alert('Blog deleted successfully!')
                navigate('/blogs')
            } catch (err) {
                alert(`Failed to delete blog: ${err.message}`)
            }
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const isOwner = () => {
        if (!blog) return false
        const currentUserId = ApiClient.getUserId()
        return currentUserId && String(blog.author.id) === String(currentUserId)
    }

    return (
        <>
            <Navbar />
            <main className="container">
                {loading ? (
                    <p className="loading">Loading blog...</p>
                ) : error ? (
                    <p className="error-message">Failed to load blog: {error}</p>
                ) : blog ? (
                    <div className="blog-detail">
                        <header className="blog-detail-header">
                            <h1 id="blogTitle" className='blog-detail-title'>{blog.title}</h1>
                            <div className="blog-detail-meta">
                                <p id="blogAuthor" className="blog-detail-author">By {blog.author.first_name} {blog.author.last_name}</p>
                                <p id="blogDate" className="blog-detail-date">{formatDate(blog.created_at)}</p>
                                <span id="blogStatus" className={`blog-status ${blog.status}`}>
                                    {blog.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </header>
                        <div id="blogContent" className="blog-detail-content">
                            {blog.content.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                        {isOwner() && (
                            <div id="blogActions" className="blog-detail-actions" style={{ display: 'flex' }}>
                                <button id="editBtn" className="btn-primary" onClick={() => navigate(`/edit/${id}`)}>
                                    Edit Blog
                                </button>
                                <button id="deleteBtn" className="btn-delete" onClick={handleDelete}>
                                    Delete Blog
                                </button>
                            </div>
                        )}

                        <div className="blog-detail-footer">
                            <Link className="btn-secondary" to="/blogs">← Back to All Blogs</Link>
                        </div>
                    </div>
                ) : null}
            </main>
        </>
    )
}

export default BlogDetail
