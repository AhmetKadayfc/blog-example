# Web101 Blog Application Project

A comprehensive blog application project demonstrating different frontend frameworks and technologies, all connected to a unified Flask backend. This is a learning resource showcasing the evolution from JavaScript to modern frameworks.

## 🎯 Project Overview

This project consists of:

- **1 Backend**: Flask-based REST API with PostgreSQL database
- **4 Frontend Implementations**: Different approaches to building the same blog application

## 📁 Project Structure

```
project/
├── backend/              # Flask REST API (Python)
├── frontend-raw/         # Raw HTML/CSS (no JavaScript)
├── frontend-01/          # JavaScript (ES6+)
├── frontend-02/          # React + Vite
└── frontend-03/          # Next.js + TypeScript + Tailwind CSS
```

## 🌟 Features

All frontend implementations support:

- **User Authentication**: Register and login with JWT tokens
- **Blog CRUD Operations**: Create, read, update, and delete blog posts
- **Blog Listing**: View all active blogs
- **Blog Detail**: View individual blog posts with full content
- **Protected Routes**: Authentication required for create/update/edit operations

## 🚀 Quick Start

### 1. Backend Setup

Navigate to the backend directory and follow these steps:

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
.\venv\Scripts\Activate.ps1  # Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m flask --app src.app init-db

# Run the server
python -m flask --app src.app run --debug
```

The backend API will be available at `http://127.0.0.1:5000/api`

**📝 Note**: Make sure PostgreSQL is installed and running. Create a database named `blog_db`.

For detailed backend setup, see [backend/README.md](backend/README.md)

### 2. Frontend Setup

Choose your preferred frontend implementation:

#### Frontend-Raw (Static HTML/CSS)

```bash
cd frontend-raw
# Simply open index.html in your browser
```

#### Frontend-01 (Pure JavaScript)

```bash
cd frontend-01
# Open index.html with live server in your browser
```

See [frontend-01/README.md](frontend-01/README.md) for details.

#### Frontend-02 (React + Vite)

```bash
cd frontend-02
npm install
npm run dev
# Open http://localhost:3000
```

See [frontend-02/README.md](frontend-02/README.md) for details.

#### Frontend-03 (Next.js + TypeScript)

```bash
cd frontend-03
npm install
npm run dev
# Open http://localhost:3000
```

See [frontend-03/README.md](frontend-03/README.md) for details.

## 🛠 Tech Stack

### Backend

- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **CORS**: Flask-CORS
- **Password Hashing**: Werkzeug

### Frontend Implementations

| Implementation   | Technologies                                 | Purpose                                               |
| ---------------- | -------------------------------------------- | ----------------------------------------------------- |
| **frontend-raw** | HTML, CSS                                    | Static markup foundation                              |
| **frontend-01**  | HTML, CSS                                    | Pure JavaScript with modern ES6+ features             |
| **frontend-02**  | React, Vite, React Router                    | Component-based architecture with build tools         |
| **frontend-03**  | Next.js, TypeScript, Tailwind CSS, shadcn/ui | Full-stack React framework with server-side rendering |

## 📚 Learning Path

This project is structured to demonstrate the progression of web development:

1. **frontend-raw**: Start with basic HTML/CSS to understand structure and styling
2. **frontend-01**: Understanding DOM manipulation and API calls
3. **frontend-02**: Learn component-based architecture with React and modern build tools
4. **frontend-03**: Master production-ready applications with Next.js, TypeScript, and enterprise patterns

## 🔌 API Endpoints

The backend provides the following endpoints:

- `POST /health` - Check if the API is healthy.

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Blogs

- `GET /api/blogs` - Get all active blogs
- `GET /api/blogs/:id` - Get single blog by ID
- `POST /api/blogs` - Create new blog (requires auth)
- `PUT /api/blogs/:id` - Update blog (requires auth)
- `DELETE /api/blogs/:id` - Delete blog (requires auth)

## 🔐 Environment Variables

Backend requires a `.env` file with:

```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=blog_db
DB_HOST=localhost
SECRET_KEY=your_secret_key
```

## 🤝 Contributing

Feel free to:

- Experiment with different implementations
- Add new features to practice
- Improve existing code
- Compare different approaches across frontends

## 📝 Hakkında / About

This is a basic level application I developed to teach web application development to my students. The aim was to explain backend-frontend integration, API design, and authentication/authorization concepts through a practical application. It enables comparative learning of different technology stacks by demonstrating the evolution from JavaScript to modern frameworks.

## 🎓 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Happy Learning! 🚀**
