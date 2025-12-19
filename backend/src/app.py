import sys
import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


from .config import Config
from .db import execute_query
from .auth import generate_token, auth_required, g

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS
CORS(app, origins=["http://127.0.0.1:5500", "http://localhost:3000"])

# --- Utilities ---
def get_uuid():
    return str(uuid.uuid4())

# --- Auth Routes ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Check if user exists
    existing_user = execute_query("SELECT id FROM \"user\" WHERE email = %s", (email,), fetch_one=True)
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    user_id = get_uuid()

    execute_query(
        "INSERT INTO \"user\" (id, email, password, first_name, last_name) VALUES (%s, %s, %s, %s, %s)",
        (user_id, email, hashed_password, first_name, last_name),
        commit=True
    )

    return jsonify({'message': 'User registered successfully', 'user_id': user_id}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = execute_query("SELECT id, password FROM \"user\" WHERE email = %s", (email,), fetch_one=True)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user['id'])
    return jsonify({'token': token, 'user_id': user['id']}), 200

# --- Blog Routes ---
@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    # Filtering
    status = request.args.get('status')
    user_id = request.args.get('user_id')

    query = """
        SELECT 
            b.id, b.title, b.content, b.thumbnail_image, b.status, b.created_at,
            u.id as author_id, u.first_name, u.last_name, u.email, u.image as user_image
        FROM blog b
        LEFT JOIN "user" u ON b.user_id = u.id
        WHERE 1=1
    """
    params = []

    if status:
        query += " AND b.status = %s"
        params.append(status)
    
    if user_id:
        query += " AND b.user_id = %s"
        params.append(user_id)

    query += " ORDER BY b.created_at DESC"

    blogs = execute_query(query, tuple(params), fetch_all=True)
    
    # Transform to include author as nested object
    formatted_blogs = []
    for blog in blogs:
        formatted_blog = {
            'id': blog['id'],
            'title': blog['title'],
            'content': blog['content'],
            'thumbnail_image': blog['thumbnail_image'],
            'status': blog['status'],
            'created_at': blog['created_at'],
            'author': {
                'id': blog['author_id'],
                'first_name': blog['first_name'],
                'last_name': blog['last_name'],
                'email': blog['email'],
                'image': blog['user_image']
            } if blog.get('author_id') else None
        }
        formatted_blogs.append(formatted_blog)
    
    return jsonify(formatted_blogs), 200

@app.route('/api/blogs/<blog_id>', methods=['GET'])
def get_blog(blog_id):
    query = """
        SELECT 
            b.id, b.title, b.content, b.thumbnail_image, b.status, b.created_at,
            u.id as author_id, u.first_name, u.last_name, u.email, u.image as user_image
        FROM blog b
        LEFT JOIN "user" u ON b.user_id = u.id
        WHERE b.id = %s
    """
    blog = execute_query(query, (blog_id,), fetch_one=True)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    # Transform to include author as nested object
    formatted_blog = {
        'id': blog['id'],
        'title': blog['title'],
        'content': blog['content'],
        'thumbnail_image': blog['thumbnail_image'],
        'status': blog['status'],
        'created_at': blog['created_at'],
        'author': {
            'id': blog['author_id'],
            'first_name': blog['first_name'],
            'last_name': blog['last_name'],
            'email': blog['email'],
            'image': blog['user_image']
        } if blog.get('author_id') else None
    }
    
    return jsonify(formatted_blog), 200

@app.route('/api/blogs', methods=['POST'])
@auth_required
def create_blog():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    status = data.get('status', 'draft')
    
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    blog_id = get_uuid()
    user_id = g.user_id

    execute_query(
        "INSERT INTO blog (id, title, content, status, user_id) VALUES (%s, %s, %s, %s, %s)",
        (blog_id, title, content, status, user_id),
        commit=True
    )

    # Handle Categories and Tags if present
    categories = data.get('category_ids', [])
    for cat_id in categories:
        execute_query(
            "INSERT INTO blog_category (id, blog_id, category_id) VALUES (%s, %s, %s)",
            (get_uuid(), blog_id, cat_id),
            commit=True
        )

    return jsonify({'message': 'Blog created', 'id': blog_id}), 201

@app.route('/api/blogs/<blog_id>', methods=['PUT'])
@auth_required
def update_blog(blog_id):
    data = request.get_json()
    
    # Check ownership
    blog = execute_query("SELECT user_id FROM blog WHERE id = %s", (blog_id,), fetch_one=True)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    if blog['user_id'] != g.user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    title = data.get('title')
    content = data.get('content')
    status = data.get('status')

    # Build dynamic update query
    fields = []
    params = []
    if title:
        fields.append("title = %s")
        params.append(title)
    if content:
        fields.append("content = %s")
        params.append(content)
    if status:
        fields.append("status = %s")
        params.append(status)
    
    if not fields:
        return jsonify({'message': 'No fields to update'}), 200

    params.append(blog_id)
    query = f"UPDATE blog SET {', '.join(fields)} WHERE id = %s"
    
    execute_query(query, tuple(params), commit=True)
    return jsonify({'message': 'Blog updated'}), 200

@app.route('/api/blogs/<blog_id>', methods=['DELETE'])
@auth_required
def delete_blog(blog_id):
    blog = execute_query("SELECT user_id FROM blog WHERE id = %s", (blog_id,), fetch_one=True)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    if blog['user_id'] != g.user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    execute_query("DELETE FROM blog WHERE id = %s", (blog_id,), commit=True)
    return jsonify({'message': 'Blog deleted'}), 200

# --- Root/Test ---
@app.route('/health')
def home():
    return jsonify({'message': 'Blog API is running!', 'version': '1.0.0'})

# --- CLI Commands ---
@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    try:
        # Construct absolute path to schema.sql based on current file location
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as f:
            schema = f.read()
        execute_query(schema, commit=True)
        print('Database initialized successfully.')
    except Exception as e:
        print(f'Error initializing database: {e}')

if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
