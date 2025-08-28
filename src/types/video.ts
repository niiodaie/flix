export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  creatorId: string;
  creator: {
    username: string;
    avatarUrl: string;
  };
  views: number;
  likes: number;
  comments: number;
  affiliateUrl?: string; // New field for monetization
  createdAt: string;
  updatedAt: string;
}

export interface WatchEvent {
  id: number;
  userId: string;
  videoId: string;
  dwellMs: number;
  completed: boolean;
  liked: boolean;
  commented: boolean;
  followed: boolean;
  createdAt: string;
}

export interface Tip {
  id: number;
  fromUser: string;
  toUser: string;
  videoId?: string;
  amountCents: number;
  currency: string;
  stripePaymentId?: string;
  createdAt: string;
}

export interface SponsoredVideo {
  id: number;
  videoId: string;
  sponsorName?: string;
  placement: string;
  startDate?: string;
  endDate?: string;
  targetingJson?: any;
  createdAt: string;
}


