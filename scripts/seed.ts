import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seed() {
  console.log("Seeding database...");

  // Example: Add a dummy user
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: "test@example.com",
    password: "password123",
    email_confirm: true,
  });

  if (userError) {
    console.error("Error creating user:", userError.message);
  } else {
    console.log("User created:", user);

    // Example: Add a dummy profile
    const { data: profile, error: profileError } = await supabase.from("profiles").insert([
      {
        id: user?.user?.id,
        username: "testuser",
        avatar_url: "https://via.placeholder.com/150",
        bio: "A test user profile.",
        handle: "@testuser",
      },
    ]);

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
    } else {
      console.log("Profile created:", profile);
    }

    // Example: Add a dummy video
    const { data: video, error: videoError } = await supabase.from("videos").insert([
      {
        title: "My First Video",
        description: "This is a test video.",
        thumbnail_url: "https://via.placeholder.com/300x180",
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        creator_id: user?.user?.id,
        views: 0,
        likes: 0,
      },
    ]);

    if (videoError) {
      console.error("Error creating video:", videoError.message);
    } else {
      console.log("Video created:", video);
    }
  }

  console.log("Seeding complete.");
}

seed();


