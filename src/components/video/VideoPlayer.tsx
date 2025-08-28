export function VideoPlayer({ videoId }: { videoId: string }) {
  return (
    <div className="w-full bg-black aspect-video flex items-center justify-center text-white">
      <p>Video Player for {videoId}</p>
      {/* Placeholder for actual video player logic (e.g., HLS.js, Mux player) */}
    </div>
  );
}


