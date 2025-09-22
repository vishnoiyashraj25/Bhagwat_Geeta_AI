-- enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    phone_number VARCHAR(30) UNIQUE,
    language_preference VARCHAR(10) DEFAULT 'en',
    gita_familiarity_level INTEGER CHECK (gita_familiarity_level BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE mantras (
    id SERIAL PRIMARY KEY,
    tag_id INTEGER REFERENCES tags(id),
    priority_number INTEGER,
    sanskrit_text TEXT,
    transliteration TEXT,
    meaning TEXT,
    application_context TEXT,
    chapter_verse VARCHAR(20),
    language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    tag_id INTEGER REFERENCES tags(id),
    priority_number INTEGER,
    title VARCHAR(255),
    content TEXT,
    moral_lesson TEXT,
    language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE beliefs (
    id SERIAL PRIMARY KEY,
    tag_id INTEGER REFERENCES tags(id),
    priority_number INTEGER,
    belief_text TEXT,
    explanation TEXT,
    language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    tag_id INTEGER REFERENCES tags(id),
    priority_number INTEGER,
    action_title VARCHAR(255),
    description TEXT,
    duration_minutes INTEGER,
    language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE youtube_videos (
    id SERIAL PRIMARY KEY,
    tag_id INTEGER REFERENCES tags(id),
    priority_number INTEGER,
    video_title VARCHAR(255),
    video_url VARCHAR(500),
    description TEXT,
    speaker VARCHAR(100),
    duration_seconds INTEGER,
    language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id UUID,
    user_message TEXT,
    ai_response TEXT,
    generated_tags TEXT[],
    content_type VARCHAR(50),
    content_id INTEGER,
    timestamp TIMESTAMP DEFAULT now()
);
