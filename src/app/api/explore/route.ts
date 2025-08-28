import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Logic to fetch trending/explore videos
  return NextResponse.json({ message: "Explore API - GET" });
}


