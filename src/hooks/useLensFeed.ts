import { useState, useEffect } from "react";
import { getLensFeed } from "@/lib/lens";
import { Video } from "@/types/video";

export function useLensFeed(userId: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const data = await getLensFeed(userId);
        setVideos(data.videos);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [userId]);

  return { videos, loading, error };
}


