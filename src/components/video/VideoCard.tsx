import Link from "next/link";
import { useState } from "react";
import { TipDialog } from "@/components/tips/TipDialog";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
    creator: {
      username: string;
      avatarUrl: string;
    };
    views: number;
    createdAt: string;
    affiliateUrl?: string;
    isSponsored?: boolean;
    sponsorName?: string;
  };
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
  const [startTime] = useState(Date.now());

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLiked(!liked);
    onInteraction?.({ liked: !liked });
  };

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (video.affiliateUrl) {
      window.open(video.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowTipDialog(true);
  };

  const handleCardClick = () => {
    const dwellMs = Date.now() - startTime;
    onInteraction?.({ dwellMs });
  };

  return (
    <>
      <Link href={`/watch/${video.id}`} onClick={handleCardClick}>
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative">
          {video.isSponsored && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold z-10">
              Sponsored
            </div>
          )}
          
          <div className="relative">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-48 object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white truncate mb-2">{video.title}</h3>
            
            <div className="flex items-center mb-3">
              <img 
                src={video.creator.avatarUrl} 
                alt={video.creator.username} 
                className="w-8 h-8 rounded-full mr-2" 
              />
              <p className="text-gray-400 text-sm">{video.creator.username}</p>
            </div>
            
            <p className="text-gray-500 text-xs mb-3">
              {video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}
            </p>

            {video.isSponsored && video.sponsorName && (
              <p className="text-yellow-400 text-xs mb-3">
                Sponsored by {video.sponsorName}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                    liked 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                  <span>{liked ? 'Liked' : 'Like'}</span>
                </button>

                {currentUserId && currentUserId !== video.creator.username && (
                  <button
                    onClick={handleTipClick}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                    </svg>
                    <span>Tip</span>
                  </button>
                )}
              </div>

              {showAffiliateLink && video.affiliateUrl && (
                <button
                  onClick={handleAffiliateClick}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                >
                  Shop Now
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {showTipDialog && currentUserId && (
        <TipDialog
          isOpen={showTipDialog}
          onClose={() => setShowTipDialog(false)}
          creatorId={video.creator.username}
          creatorName={video.creator.username}
          videoId={video.id}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}


