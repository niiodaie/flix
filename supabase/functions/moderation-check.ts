// Supabase Edge Function for content moderation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { content } = await req.json();

  // Placeholder for moderation logic (e.g., calling an AI moderation API)
  const isSafe = !content.includes("badword"); // Simple check

  return new Response(JSON.stringify({ isSafe }), {
    headers: { "Content-Type": "application/json" },
  });
});


