'use client';

import { useState, useEffect } from 'react';
import { repo, Video } from '@/lib/data';
import { VideoCard } from '@/components/video/VideoCard';
import { Navbar } from '@/components/layout/Navbar';

export default function ExplorePage() {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [exploreVideos, setExploreVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const [trending, explore] = await Promise.all([
          repo.getTrending({ limit: 12 }),
          repo.getExplore({ limit: 20 })
        ]);
        
        setTrendingVideos(trending);
        setExploreVideos(explore);
        setError(null);
      } catch (err) {
        console.error('Error loading explore content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading explore content...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-400 mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Demo Mode Banner */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            🎭 <strong>Demo Mode</strong> — Explore trending and random content from our mock database!
          </p>
        </div>

        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <p className="text-gray-400 text-sm">Most popular videos right now</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                showAffiliateLink={!!video.affiliateUrl}
                currentUserId="user_demo"
              />
            ))}
          </div>
        </section>

        {/* Explore Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Discover</h2>
              <p className="text-gray-400 text-sm">Fresh content from creators around the world</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exploreVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                showAffiliateLink={!!video.affiliateUrl}
                currentUserId="user_demo"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

