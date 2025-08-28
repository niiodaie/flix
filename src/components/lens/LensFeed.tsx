import { VideoCard } from "@/components/video/VideoCard";

export function LensFeed() {
  // Placeholder for fetching personalized video data
  const videos = [
    {
      id: "1",
      title: "Epic Mountain Biking",
      thumbnailUrl: "https://via.placeholder.com/300x180/0000FF/FFFFFF?text=Video+1",
      creator: { username: "AdventureSeeker", avatarUrl: "https://via.placeholder.com/40/FF0000/FFFFFF?text=AS" },
      views: 12345,
      createdAt: "2 days ago",
    },
    {
      id: "2",
      title: "Cooking Masterclass: Pasta",
      thumbnailUrl: "https://via.placeholder.com/300x180/00FF00/FFFFFF?text=Video+2",
      creator: { username: "ChefJohn", avatarUrl: "https://via.placeholder.com/40/00FF00/FFFFFF?text=CJ" },
      views: 8765,
      createdAt: "1 week ago",
    },
    {
      id: "3",
      title: "Coding Tutorial: Next.js",
      thumbnailUrl: "https://via.placeholder.com/300x180/FF00FF/FFFFFF?text=Video+3",
      creator: { username: "DevGuru", avatarUrl: "https://via.placeholder.com/40/FF00FF/FFFFFF?text=DG" },
      views: 23456,
      createdAt: "3 days ago",
    },
    {
      id: "4",
      title: "Yoga for Beginners",
      thumbnailUrl: "https://via.placeholder.com/300x180/FFFF00/000000?text=Video+4",
      creator: { username: "ZenLife", avatarUrl: "https://via.placeholder.com/40/FFFF00/000000?text=ZL" },
      views: 5432,
      createdAt: "4 days ago",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}


