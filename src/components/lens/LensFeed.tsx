"use client";

import { useState, useEffect } from "react";
import { VideoCard } from "@/components/video/VideoCard";
import { Video } from "@/types/video";

interface LensFeedProps {
  userId?: string;
}

export function LensFeed({ userId = "demo-user" }: LensFeedProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchLensVideos = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      
      const response = await fetch(`/api/lens?userId=${userId}&limit=20&offset=${currentOffset}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (reset) {
        setVideos(data.videos || []);
        setOffset(20);
      } else {
        setVideos(prev => [...prev, ...(data.videos || [])]);
        setOffset(prev => prev + 20);
      }
      
      setHasMore(data.hasMore || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching LENS feed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load LENS feed';
      setError(errorMessage);
      
      // Don't crash the UI - show user-friendly message
      if (reset) {
        setVideos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLensVideos(true);
  }, [userId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLensVideos(false);
    }
  };

  const handleVideoInteraction = async (videoId: string, interaction: {
    dwellMs?: number;
    completed?: boolean;
    liked?: boolean;
    commented?: boolean;
    followed?: boolean;
  }) => {
    try {
      await fetch('/api/lens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          videoId,
          ...interaction
        })
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized LENS feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchLensVideos(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No videos in your LENS feed yet.</p>
          <p className="text-gray-400 text-sm">
            Start watching and interacting with videos to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your LENS Feed</h2>
        <button 
          onClick={() => fetchLensVideos(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onInteraction={(interaction) => handleVideoInteraction(video.id, interaction)}
            showAffiliateLink={!!video.affiliateUrl}
            currentUserId={userId}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

