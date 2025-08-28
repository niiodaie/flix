-- Supabase RLS policies for FLIX

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for videos
CREATE POLICY "Users can view all videos." ON videos FOR SELECT USING (true);
CREATE POLICY "Users can insert their own videos." ON videos FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own videos." ON videos FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete their own videos." ON videos FOR DELETE USING (auth.uid() = creator_id);

-- Policies for likes
CREATE POLICY "Users can view all likes." ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes." ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes." ON likes FOR DELETE USING (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Users can view all comments." ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments." ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments." ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON comments FOR DELETE USING (auth.uid() = user_id);

-- Policies for watch_events
CREATE POLICY "Users can view their own watch events." ON watch_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own watch events." ON watch_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for tips
CREATE POLICY "Users can view tips they sent or received." ON tips FOR SELECT USING (auth.uid() = from_user OR auth.uid() = to_user);
CREATE POLICY "Users can insert their own tips." ON tips FOR INSERT WITH CHECK (auth.uid() = from_user);

-- Policies for sponsored_videos
CREATE POLICY "Users can view all sponsored videos." ON sponsored_videos FOR SELECT USING (true);

-- Policies for follows
CREATE POLICY "Users can view all follows." ON follows FOR SELECT USING (true);
CREATE POLICY "Users can insert their own follows." ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows." ON follows FOR DELETE USING (auth.uid() = follower_id);


