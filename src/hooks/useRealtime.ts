import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtime<T>(channelName: string, eventName: string, schema: string, table: string) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase.channel(channelName);

    const handleEvent = (payload: any) => {
      // This is a simplified handler. In a real app, you'd handle INSERT, UPDATE, DELETE.
      setData((prevData) => [...prevData, payload.new as T]);
    };

    channel
      .on(
        "postgres_changes",
        { event: eventName, schema: schema, table: table },
        handleEvent
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Subscribed to ${channelName} for ${table} ${eventName} events`);
        } else if (status === "CHANNEL_ERROR") {
          setError(`Error subscribing to ${channelName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, eventName, schema, table]);

  return { data, error };
}


