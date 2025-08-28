'use client';

import { useState, useEffect } from 'react';
import { repo, Video } from '@/lib/data';
import { VideoCard } from '../video/VideoCard';

interface LensFeedProps {
  userId?: string;
}

export function LensFeed({ userId }: LensFeedProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchLensVideos = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      
      const data = await repo.getLensFeed({ 
        limit: 20, 
        cursor: currentOffset.toString(),
        userId 
      });

      if (reset) {
        setVideos(data);
        setOffset(20);
      } else {
        setVideos(prev => [...prev, ...data]);
        setOffset(prev => prev + 20);
      }
      
      setHasMore(data.length === 20);
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

  const handleRefresh = () => {
    fetchLensVideos(true);
  };

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
      if (interaction.dwellMs) {
        await repo.trackView(videoId, interaction.dwellMs);
      }
      if (interaction.liked) {
        await repo.like(videoId);
        await repo.trackInteraction(videoId, 'like');
      }
      if (interaction.commented) {
        await repo.trackInteraction(videoId, 'comment');
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized LENS feed...</p>
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your LENS Feed</h2>
          <p className="text-gray-400 text-sm">Personalized content just for you</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Demo Mode Banner */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
        <p className="text-yellow-400 text-sm">
          🎭 <strong>Demo Mode</strong> — Data is local to your browser. 
          Your interactions help personalize this feed!
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-6 py-3 rounded-lg text-white"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* No more content */}
      {!hasMore && videos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">You've reached the end of your LENS feed</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Refresh for new content
          </button>
        </div>
      )}

      {/* Empty state */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">No videos in your LENS feed yet</p>
          <p className="text-gray-500 text-sm">
            Start watching and interacting with videos to get personalized recommendations!
          </p>
        </div>
      )}
    </div>
  );
}

