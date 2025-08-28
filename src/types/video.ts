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
  createdAt: string;
  updatedAt: string;
}


