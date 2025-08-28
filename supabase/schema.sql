-- Supabase schema for FLIX

-- Users table (managed by Supabase Auth)
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  handle TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  views BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Likes table
CREATE TABLE likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES videos(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Comments table
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES videos(id) NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id BIGINT REFERENCES comments(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Watch events table
CREATE TABLE watch_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES videos(id) NOT NULL,
  watch_duration_seconds INT,
  completed BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tips table
CREATE TABLE tips (
  id BIGSERIAL PRIMARY KEY,
  tipper_id UUID REFERENCES auth.users(id) NOT NULL,
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  amount_cents INT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsored videos table
CREATE TABLE sponsored_videos (
  id BIGSERIAL PRIMARY KEY,
  video_id UUID REFERENCES videos(id) NOT NULL,
  sponsor_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);


