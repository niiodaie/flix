import { useState, useEffect } from "react";
import { fetchFromApi } from "@/lib/api";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchFromApi(`/notifications?userId=${userId}`);
        setNotifications(data.notifications);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [userId]);

  return { notifications, loading, error };
}


