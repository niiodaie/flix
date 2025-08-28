import { useState } from "react";
import { uploadVideo } from "@/lib/video";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, metadata: any) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      const result = await uploadVideo(file, metadata);
      return result;
    } catch (err) {
      setError((err as Error).message);
      return { success: false, message: (err as Error).message };
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, progress, error };
}


