import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Logic to fetch comments for a video
  return NextResponse.json({ message: "Comments API - GET" });
}

export async function POST(request: Request) {
  // Logic to post a new comment
  return NextResponse.json({ message: "Comments API - POST" });
}


