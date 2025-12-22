import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApiClient from '../api/client'

function Home() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadRecentBlogs()
    }, [])

    const loadRecentBlogs = async () => {
        try {
            const response = await ApiClient.blogs.getAll()
            const allBlogs = response || []
            // Get last 3 blogs
            setBlogs(allBlogs.slice(0, 3))
            setLoading(false)
        } catch (err) {
            setError('Failed to load blogs')
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <>
            <Navbar></Navbar>

            <section className="hero">
                <div className="profile-image">
                    <img src="/assets/images/profile-photo.png" alt="Coder Name" />
                </div>
                <div className="hero-content">
                    <h1>Hi there, my name is "Ahmet Kadayıfçı" 👋</h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt mollitia dicta sequi dolor
                        consequuntur facere ab consequatur, praesentium nobis saepe.</p>
                    <a href="#details" className="details-btn">Details <i className="fa-solid fa-chevron-right"></i></a>
                </div>
            </section>

            <section className="blog-section">
                <div className="blog-grid">
                    {loading ? (
                        <p className="loading">Loading blogs...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : blogs.length === 0 ? (
                        <p className="no-data">No blogs available yet.</p>
                    ) : (
                        blogs.map(blog => (
                            <article key={blog.id} className="blog-card">
                                <div className="blog-image"></div>
                                <Link to={`/blog/${blog.id}`}>
                                    <h3 className="blog-title">{blog.title}</h3>
                                </Link>
                                <p className="blog-date">{formatDate(blog.created_at)}</p>
                            </article>
                        ))
                    )}
                </div>
                <Link to="/blogs" className="view-all">View all →</Link>
            </section>

            <footer>
                <p>created by Ahmet Kadayıfçı</p>
            </footer>
        </>
    )
}

export default Home
