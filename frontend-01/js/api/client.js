// API Client for Blog Backend
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Cookie management utilities
const CookieManager = {
    set: (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    delete: (name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }
};

// API Client
const ApiClient = {
    // Get auth token from cookie
    getToken: () => {
        return CookieManager.get('auth_token');
    },

    // Store auth token in cookie
    setToken: (token) => {
        CookieManager.set('auth_token', token, 7);
    },

    // Remove auth token
    clearToken: () => {
        CookieManager.delete('auth_token');
        CookieManager.delete('user_id');
    },

    // Get user ID from cookie
    getUserId: () => {
        return CookieManager.get('user_id');
    },

    // Store user ID in cookie
    setUserId: (userId) => {
        CookieManager.set('user_id', userId, 7);
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!ApiClient.getToken();
    },

    // Base request method
    request: async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = ApiClient.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    auth: {
        register: async (email, password, firstName, lastName) => {
            const data = await ApiClient.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName
                })
            });
            return data;
        },

        login: async (email, password) => {
            const data = await ApiClient.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Store token and user_id if login successful
            if (data.token) {
                ApiClient.setToken(data.token);
            }
            if (data.user_id) {
                ApiClient.setUserId(data.user_id);
            }

            return data;
        },

        logout: () => {
            ApiClient.clearToken();
        }
    },

    // Blog endpoints
    blogs: {
        getAll: async () => {
            const endpoint = '/blogs?status=active';
            return await ApiClient.request(endpoint, { method: 'GET' });
        },

        getById: async (id) => {
            return await ApiClient.request(`/blogs/${id}`, { method: 'GET' });
        },

        create: async (blogData) => {
            return await ApiClient.request('/blogs', {
                method: 'POST',
                body: JSON.stringify(blogData)
            });
        },

        update: async (id, blogData) => {
            return await ApiClient.request(`/blogs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(blogData)
            });
        },

        delete: async (id) => {
            return await ApiClient.request(`/blogs/${id}`, {
                method: 'DELETE'
            });
        }
    }
};

// Export for use in other files
window.ApiClient = ApiClient;
