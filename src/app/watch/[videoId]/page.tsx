import { VideoPlayer } from "@/components/video/VideoPlayer";

export default function WatchPage({ params }: { params: { videoId: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Watching Video: {params.videoId}</h1>
      <VideoPlayer videoId={params.videoId} />
    </div>
  );
}


