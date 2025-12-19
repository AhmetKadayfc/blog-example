-- UUID extension might be needed if using uuid for IDs, but for simplicity assuming SERIAL or VARCHAR(36)
-- User table
CREATE TABLE IF NOT EXISTS "user" (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    image TEXT,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Setting table
CREATE TABLE IF NOT EXISTS user_setting (
    id VARCHAR(36) PRIMARY KEY,
    theme VARCHAR(20),
    language VARCHAR(10),
    user_id VARCHAR(36) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Project table
CREATE TABLE IF NOT EXISTS project (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(20),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    user_id VARCHAR(36) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Blog table
CREATE TABLE IF NOT EXISTS blog (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    thumbnail_image TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Category table
CREATE TABLE IF NOT EXISTS category (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Blog Category Junction
CREATE TABLE IF NOT EXISTS blog_category (
    id VARCHAR(36) PRIMARY KEY,
    blog_id VARCHAR(36) REFERENCES blog(id) ON DELETE CASCADE,
    category_id VARCHAR(36) REFERENCES category(id) ON DELETE CASCADE
);

-- Tag table
CREATE TABLE IF NOT EXISTS tag (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Blog Tag Junction
CREATE TABLE IF NOT EXISTS blog_tag (
    id VARCHAR(36) PRIMARY KEY,
    blog_id VARCHAR(36) REFERENCES blog(id) ON DELETE CASCADE,
    tag_id VARCHAR(36) REFERENCES tag(id) ON DELETE CASCADE
);
