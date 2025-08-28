import { Video } from "@/types/video";

export interface LensFeedResponse {
  videos: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}


