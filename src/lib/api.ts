import { supabase } from "@/lib/supabaseClient";

export const fetchFromApi = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`/api${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};


