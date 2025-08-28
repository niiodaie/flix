export interface User {
  id: string;
  email: string;
  username: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  username: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Follow {
  id: number;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface CreatorStats {
  totalViews: number;
  totalWatchTime: number;
  totalTips: number;
  totalVideos: number;
  lensRecommendations: number;
}


