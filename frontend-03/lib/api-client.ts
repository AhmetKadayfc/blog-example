// Direct Backend API Client - Calls backend API directly

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// LocalStorage utilities for token management
const TokenManager = {
    get: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    },
    
    set: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('auth_token', token);
    },
    
    remove: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
    },
    
    getUserId: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('user_id');
    },
    
    setUserId: (userId: number): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('user_id', userId.toString());
    }
};

// Types
interface Author {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Blog {
    id: number;
    title: string;
    content: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    author: Author;
}

interface LoginResponse {
    message: string;
    user_id: number;
    token: string;
}

interface RegisterResponse {
    message: string;
}

// API Client - Calls backend directly
const ApiClient = {
    // Get user ID from localStorage
    getUserId: (): string | null => {
        return TokenManager.getUserId();
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!TokenManager.get();
    },

    // Base request method for backend API
    request: async (endpoint: string, options: RequestInit = {}): Promise<any> => {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = TokenManager.get();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>)
        };

        // Add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints - Call backend directly
    auth: {
        register: async (email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponse> => {
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

        login: async (email: string, password: string): Promise<LoginResponse> => {
            const data = await ApiClient.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            // Store token and user_id in localStorage
            if (data.token) {
                TokenManager.set(data.token);
            }
            if (data.user_id) {
                TokenManager.setUserId(data.user_id);
            }
            
            return data;
        },

        logout: async (): Promise<void> => {
            // Clear local storage
            TokenManager.remove();
        }
    },

    // Blog endpoints - Call backend directly
    blogs: {
        getAll: async (): Promise<Blog[]> => {
            return await ApiClient.request('/blogs?status=active', { method: 'GET' });
        },

        getById: async (id: string): Promise<Blog> => {
            return await ApiClient.request(`/blogs/${id}`, { method: 'GET' });
        },

        create: async (blogData: { title: string; content: string; status: string }): Promise<Blog> => {
            return await ApiClient.request('/blogs', {
                method: 'POST',
                body: JSON.stringify(blogData)
            });
        },

        update: async (id: string, blogData: { title: string; content: string; status: string }): Promise<Blog> => {
            return await ApiClient.request(`/blogs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(blogData)
            });
        },

        delete: async (id: string): Promise<void> => {
            return await ApiClient.request(`/blogs/${id}`, {
                method: 'DELETE'
            });
        }
    }
};

// Server-side fetch functions for Server Components
export async function fetchBlogs(): Promise<Blog[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs?status=active`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

export async function fetchBlogById(id: string): Promise<Blog | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

export default ApiClient;
export type { Blog, Author };
