import Link from "next/link";

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
  };
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">{video.title}</h3>
          <div className="flex items-center mt-2">
            <img src={video.creator.avatarUrl} alt={video.creator.username} className="w-8 h-8 rounded-full mr-2" />
            <p className="text-gray-400 text-sm">{video.creator.username}</p>
          </div>
          <p className="text-gray-500 text-xs mt-1">{video.views} views &bull; {video.createdAt}</p>
        </div>
      </div>
    </Link>
  );
}


