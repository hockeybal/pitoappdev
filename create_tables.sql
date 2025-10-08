-- SQL script to create tables for Strapi content types in pitoappdash_db
-- Based on Strapi schemas for dashboard functionality

-- First, assume users table exists (from users-permissions plugin)
-- If not, uncomment below:
-- CREATE TABLE up_users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(255),
--   email VARCHAR(255) UNIQUE,
--   provider VARCHAR(255),
--   password VARCHAR(255),
--   resetPasswordToken VARCHAR(255),
--   confirmationToken VARCHAR(255),
--   confirmed BOOLEAN DEFAULT FALSE,
--   blocked BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
-- );

-- Shared components tables (simplified)
CREATE TABLE components_shared_buttons (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255),
  url VARCHAR(255),
  type VARCHAR(50)
);

CREATE TABLE components_shared_perks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT
);

CREATE TABLE components_shared_seos (
  id SERIAL PRIMARY KEY,
  metaTitle VARCHAR(255),
  metaDescription TEXT,
  keywords TEXT,
  shareImage INTEGER -- media id
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  product_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Articles table (with i18n, but simplified)
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  content JSONB, -- blocks type
  image INTEGER, -- media id
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  locale VARCHAR(10) DEFAULT 'en'
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  price INTEGER,
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Plans table
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  price INTEGER,
  sub_text TEXT,
  featured BOOLEAN DEFAULT FALSE,
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE, -- assuming one-to-one with up_users
  user_email VARCHAR(255) NOT NULL,
  plan_id INTEGER REFERENCES plans(id),
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  mollie_customer_id VARCHAR(255),
  subscription_start_date DATE,
  subscription_end_date DATE,
  current_subscription_id VARCHAR(255),
  last_payment_date TIMESTAMP,
  total_paid DECIMAL(10,2) DEFAULT 0,
  credits_available DECIMAL(10,2) DEFAULT 0,
  billing_period VARCHAR(50) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Vacatures table
CREATE TABLE vacatures (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  location_type VARCHAR(50) NOT NULL DEFAULT 'On-site',
  employment_type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
  experience_level VARCHAR(50) DEFAULT 'Mid Level',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_period VARCHAR(50) DEFAULT 'per month',
  requirements TEXT,
  benefits TEXT,
  application_email VARCHAR(255) NOT NULL,
  application_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATE,
  tags JSONB,
  user_id INTEGER REFERENCES up_users(id),
  customer_id INTEGER REFERENCES customers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Junction tables for many-to-many relations
CREATE TABLE articles_categories__categories_articles (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

-- Add foreign keys for categories
ALTER TABLE categories ADD CONSTRAINT fk_categories_product FOREIGN KEY (product_id) REFERENCES products(id);

-- Indexes for performance
CREATE INDEX idx_vacatures_user ON vacatures(user_id);
CREATE INDEX idx_vacatures_customer ON vacatures(customer_id);
CREATE INDEX idx_customers_plan ON customers(plan_id);
CREATE INDEX idx_plans_product ON plans(product_id);
CREATE INDEX idx_categories_product ON categories(product_id);