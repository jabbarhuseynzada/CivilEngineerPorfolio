-- PostgreSQL schema for tikinti_db
-- Executed automatically by the postgres Docker container on first startup.

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    area TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    service TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT '',
    company_description TEXT NOT NULL DEFAULT '',
    about_text1 TEXT NOT NULL DEFAULT '',
    about_text2 TEXT NOT NULL DEFAULT '',
    stats JSONB NOT NULL DEFAULT '[]',
    achievements JSONB NOT NULL DEFAULT '[]',
    contact_info JSONB NOT NULL DEFAULT '{}',
    working_hours JSONB NOT NULL DEFAULT '[]',
    social_links JSONB NOT NULL DEFAULT '[]',
    core_values JSONB NOT NULL DEFAULT '[]',
    hero_title TEXT NOT NULL DEFAULT 'Evinizi Xəyallarınızdan Həqiqətə Çeviririk',
    hero_subtitle TEXT NOT NULL DEFAULT '20 illik təcrübə ilə tam tikinti, təmir, elektrik işləri və daha çoxunu peşəkar keyfiyyətdə təqdim edirik.',
    hero_tagline TEXT NOT NULL DEFAULT 'Professional Tikinti Xidmətləri',
    hero_images JSONB NOT NULL DEFAULT '[]',
    about_heading TEXT NOT NULL DEFAULT 'Sizin Xəyallarınızı Həyata Keçiririk',
    about_images JSONB NOT NULL DEFAULT '[]'
);
