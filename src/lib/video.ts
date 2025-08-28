import { fetchFromApi } from "@/lib/api";

export const getVideoDetails = async (videoId: string) => {
  return fetchFromApi(`/videos/${videoId}`);
};

export const uploadVideo = async (file: File, metadata: any) => {
  // Placeholder for actual video upload logic
  console.log("Uploading video:", file.name, metadata);
  return { success: true, message: "Video upload initiated." };
};


