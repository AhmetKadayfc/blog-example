// Blog detail page logic

document.addEventListener('DOMContentLoaded', () => {
    initAuthNav();
    loadBlogDetail();
});

// Setup auth navigation
function initAuthNav() {
    const authNav = document.getElementById('authNav');

    if (ApiClient.isAuthenticated()) {
        authNav.innerHTML = `
            <a href="create-blog.html">Create Blog</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                ApiClient.auth.logout();
                window.location.href = '../index.html';
            });
        }
    } else {
        authNav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

// Load blog detail
async function loadBlogDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const blogDetail = document.getElementById('blogDetail');

    if (!blogId) {
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'No blog ID provided.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const blog = await ApiClient.blogs.getById(blogId);

        // Populate blog details
        document.getElementById('blogTitle').textContent = blog.title;
        document.getElementById('blogAuthor').textContent = `By ${blog.author.first_name} ${blog.author.last_name}`;

        const date = new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('blogDate').textContent = date;

        const statusElement = document.getElementById('blogStatus');
        statusElement.textContent = blog.status === 'active' ? 'Active' : 'Inactive';
        statusElement.className = `blog-status ${blog.status}`;

        document.getElementById('blogContent').innerHTML = `<p>${escapeHtml(blog.content).replace(/\n/g, '</p><p>')}</p>`;

        // Check if current user is the owner
        const currentUserId = ApiClient.getUserId();
        const isOwner = currentUserId && String(blog.author.id) === String(currentUserId);

        if (isOwner) {
            const blogActions = document.getElementById('blogActions');
            blogActions.style.display = 'flex';

            // Setup edit button
            document.getElementById('editBtn').addEventListener('click', () => {
                window.location.href = `edit-blog.html?id=${blogId}`;
            });

            // Setup delete button
            document.getElementById('deleteBtn').addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this blog?')) {
                    try {
                        await ApiClient.blogs.delete(blogId);
                        alert('Blog deleted successfully!');
                        window.location.href = 'blogs.html';
                    } catch (error) {
                        alert(`Failed to delete blog: ${error.message}`);
                    }
                }
            });
        }

        // Show blog detail, hide loading
        loadingMessage.style.display = 'none';
        blogDetail.style.display = 'block';
    } catch (error) {
        loadingMessage.style.display = 'none';
        errorMessage.textContent = `Failed to load blog: ${error.message}`;
        errorMessage.style.display = 'block';
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
