'use client';

import { useState, useEffect } from 'react';
import { repo, Video, Profile } from '@/lib/data';
import { TipDialog } from '@/components/tips/TipDialog';

interface VideoCardProps {
  video: Video;
  onInteraction?: (interaction: {
    dwellMs?: number;
    completed?: boolean;
    liked?: boolean;
    commented?: boolean;
    followed?: boolean;
  }) => void;
  showAffiliateLink?: boolean;
  currentUserId?: string;
}

export function VideoCard({ 
  video, 
  onInteraction, 
  showAffiliateLink = false, 
  currentUserId 
}: VideoCardProps) {
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [liked, setLiked] = useState(false);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [startTime] = useState(Date.now());

  // Load creator profile
  useEffect(() => {
    const loadCreator = async () => {
      try {
        const profile = await repo.getProfile(video.ownerId);
        setCreator(profile);
      } catch (error) {
        console.error('Error loading creator profile:', error);
      }
    };
    loadCreator();
  }, [video.ownerId]);

  // Check if video is liked (for mock driver)
  useEffect(() => {
    if (typeof window !== 'undefined' && (repo as any).hasLiked) {
      setLiked((repo as any).hasLiked(video.id));
    }
  }, [video.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (liked) {
        await repo.unlike(video.id);
      } else {
        await repo.like(video.id);
      }
      setLiked(!liked);
      onInteraction?.({ liked: !liked });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (video.affiliateUrl) {
      // Track affiliate click
      onInteraction?.({ dwellMs: Date.now() - startTime });
      window.open(video.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTipDialog(true);
  };

  const handleCardClick = () => {
    // Track view when card is clicked
    const dwellMs = Date.now() - startTime;
    repo.trackView(video.id, dwellMs);
    onInteraction?.({ dwellMs });
    
    // Navigate to video page (placeholder for now)
    console.log(`Navigate to video: ${video.id}`);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <>
      <div 
        className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors group"
        onClick={handleCardClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={video.thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
          
          {/* Sponsored badge */}
          {video.sponsored && (
            <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
              Sponsored
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Creator info */}
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={creator?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'}
              alt={creator?.name || 'Creator'}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {creator?.name || 'Loading...'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {creator?.handle || '@loading'}
              </p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-between text-gray-400 text-xs mb-3">
            <span>{formatViews(video.views)} views</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {video.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Like button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{video.likes + (liked ? 1 : 0)}</span>
              </button>

              {/* Tip button */}
              <button
                onClick={handleTip}
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-green-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>Tip</span>
              </button>
            </div>

            {/* Affiliate link */}
            {showAffiliateLink && video.affiliateUrl && (
              <button
                onClick={handleAffiliateClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
              >
                Shop Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tip Dialog */}
      {showTipDialog && creator && (
        <TipDialog
          isOpen={showTipDialog}
          onClose={() => setShowTipDialog(false)}
          creatorId={video.ownerId}
          creatorName={creator.name}
          videoId={video.id}
          currentUserId={currentUserId || 'user_demo'}
        />
      )}
    </>
  );
}

