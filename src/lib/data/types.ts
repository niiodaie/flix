// Data types for FLIX application

export type Video = {
  id: string;
  ownerId: string;
  title: string;
  desc: string;
  tags: string[];
  thumbUrl: string;
  hlsUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  duration: number;
  sponsored?: boolean;
  affiliateUrl?: string;
};

export type Profile = {
  id: string;
  handle: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  isCreator?: boolean;
};

export type Comment = {
  id: string;
  videoId: string;
  userId: string;
  text: string;
  createdAt: string;
  likes: number;
};

export type Tip = {
  id: string;
  fromUserId: string;
  toUserId: string;
  videoId: string;
  amountCents: number;
  currency: string;
  createdAt: string;
};

export type SearchResult = {
  videos: Video[];
  creators: Profile[];
};

export type FeedOptions = {
  cursor?: string;
  limit?: number;
  userId?: string;
};

// Repository interface that both mock and Supabase drivers will implement
export interface Repo {
  // Feed operations
  getLensFeed(opts?: FeedOptions): Promise<Video[]>;
  getTrending(opts?: FeedOptions): Promise<Video[]>;
  getExplore(opts?: FeedOptions): Promise<Video[]>;
  search(query: string): Promise<SearchResult>;

  // User/Profile operations
  getProfile(id: string): Promise<Profile | null>;
  getMyProfile(): Promise<Profile | null>;
  updateMyProfile(patch: Partial<Profile>): Promise<void>;

  // Engagement operations (client-only state for mock)
  like(videoId: string): Promise<void>;
  unlike(videoId: string): Promise<void>;
  comment(videoId: string, text: string): Promise<void>;
  tip(videoId: string, amountCents: number): Promise<void>;

  // Upload operations (UI only for mock)
  createDraft(meta: Partial<Video>): Promise<{ id: string }>;
  finalizeDraft(id: string): Promise<void>;

  // Analytics (for LENS personalization)
  trackView(videoId: string, dwellMs: number): Promise<void>;
  trackInteraction(videoId: string, type: 'like' | 'comment' | 'share'): Promise<void>;
}

