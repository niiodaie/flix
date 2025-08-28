import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { videoId } = params;
    const body = await request.json();
    const { affiliateUrl, userId } = body;

    if (!affiliateUrl || !userId) {
      return NextResponse.json({ 
        error: 'Affiliate URL and user ID are required' 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(affiliateUrl);
    } catch {
      return NextResponse.json({ 
        error: 'Invalid URL format' 
      }, { status: 400 });
    }

    // Check if user owns the video
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('creator_id')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (video.creator_id !== userId) {
      return NextResponse.json({ 
        error: 'You can only add affiliate links to your own videos' 
      }, { status: 403 });
    }

    // Update video with affiliate URL
    const { data, error } = await supabase
      .from('videos')
      .update({ affiliate_url: affiliateUrl })
      .eq('id', videoId)
      .select();

    if (error) {
      console.error('Error updating affiliate URL:', error);
      return NextResponse.json({ error: 'Failed to update affiliate link' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: data[0],
      message: 'Affiliate link added successfully!'
    });

  } catch (error) {
    console.error('Affiliate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { videoId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user owns the video
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('creator_id')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (video.creator_id !== userId) {
      return NextResponse.json({ 
        error: 'You can only remove affiliate links from your own videos' 
      }, { status: 403 });
    }

    // Remove affiliate URL
    const { data, error } = await supabase
      .from('videos')
      .update({ affiliate_url: null })
      .eq('id', videoId)
      .select();

    if (error) {
      console.error('Error removing affiliate URL:', error);
      return NextResponse.json({ error: 'Failed to remove affiliate link' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: data[0],
      message: 'Affiliate link removed successfully!'
    });

  } catch (error) {
    console.error('Affiliate DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

