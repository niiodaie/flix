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
  affiliate_url TEXT, -- New column for monetization
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

-- Watch events table for LENS personalization
CREATE TABLE watch_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES videos(id) NOT NULL,
  dwell_ms INT, -- Time spent watching in milliseconds
  completed BOOLEAN DEFAULT false,
  liked BOOLEAN DEFAULT false,
  commented BOOLEAN DEFAULT false,
  followed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tips table for monetization
CREATE TABLE tips (
  id BIGSERIAL PRIMARY KEY,
  from_user UUID REFERENCES auth.users(id) NOT NULL,
  to_user UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES videos(id),
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsored videos table for monetization
CREATE TABLE sponsored_videos (
  id BIGSERIAL PRIMARY KEY,
  video_id UUID REFERENCES videos(id) NOT NULL,
  sponsor_name TEXT,
  placement TEXT DEFAULT 'lens',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  targeting_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Follows table for social features
CREATE TABLE follows (
  id BIGSERIAL PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) NOT NULL,
  following_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Indexes for performance
CREATE INDEX idx_videos_creator_id ON videos(creator_id);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_watch_events_user_id ON watch_events(user_id);
CREATE INDEX idx_watch_events_video_id ON watch_events(video_id);
CREATE INDEX idx_watch_events_created_at ON watch_events(created_at DESC);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_video_id ON likes(video_id);
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_tips_to_user ON tips(to_user);
CREATE INDEX idx_tips_from_user ON tips(from_user);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);



-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "profiles_public_read"
ON public.profiles FOR SELECT
USING ( true );  -- allow public read-only

CREATE POLICY "profiles_user_upsert_self"
ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_user_update_self"
ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- RLS policies for videos
CREATE POLICY "videos_public_read"
ON public.videos FOR SELECT
USING ( true );

CREATE POLICY "videos_creator_insert"
ON public.videos FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "videos_creator_update"
ON public.videos FOR UPDATE
USING (auth.uid() = creator_id);

-- RLS policies for watch events
CREATE POLICY "watch_events_user_read"
ON public.watch_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "watch_events_user_insert"
ON public.watch_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for tips
CREATE POLICY "tips_user_read"
ON public.tips FOR SELECT
USING (auth.uid() = from_user OR auth.uid() = to_user);

CREATE POLICY "tips_user_insert"
ON public.tips FOR INSERT
WITH CHECK (auth.uid() = from_user);

-- RLS policies for sponsored videos
CREATE POLICY "sponsored_videos_public_read"
ON public.sponsored_videos FOR SELECT
USING ( true );

-- RLS policies for follows
CREATE POLICY "follows_user_read"
ON public.follows FOR SELECT
USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "follows_user_insert"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_user_delete"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);

-- RLS policies for likes
CREATE POLICY "likes_user_read"
ON public.likes FOR SELECT
USING ( true );

CREATE POLICY "likes_user_insert"
ON public.likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_user_delete"
ON public.likes FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for comments
CREATE POLICY "comments_public_read"
ON public.comments FOR SELECT
USING ( true );

CREATE POLICY "comments_user_insert"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_user_update"
ON public.comments FOR UPDATE
USING (auth.uid() = user_id);

-- Auto-insert profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, handle)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'handle', 'user_' || substr(new.id::text, 1, 8))
  );
  RETURN new;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

