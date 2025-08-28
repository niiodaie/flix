import { fetchFromApi } from "@/lib/api";

export const getLensFeed = async (userId: string, page: number = 1, limit: number = 10) => {
  return fetchFromApi(`/lens?userId=${userId}&page=${page}&limit=${limit}`);
};

export const getTrendingVideos = async (page: number = 1, limit: number = 10) => {
  return fetchFromApi(`/explore/trending?page=${page}&limit=${limit}`);
};


