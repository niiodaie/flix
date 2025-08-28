import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      videoId, 
      sponsorName, 
      placement = 'lens', 
      startDate, 
      endDate, 
      targetingJson 
    } = body;

    if (!videoId || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Video ID, start date, and end date are required' 
      }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return NextResponse.json({ 
        error: 'End date must be after start date' 
      }, { status: 400 });
    }

    if (start < new Date()) {
      return NextResponse.json({ 
        error: 'Start date cannot be in the past' 
      }, { status: 400 });
    }

    // Check if video exists
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id, title')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Insert sponsored video
    const { data, error } = await supabase
      .from('sponsored_videos')
      .insert({
        video_id: videoId,
        sponsor_name: sponsorName,
        placement,
        start_date: startDate,
        end_date: endDate,
        targeting_json: targetingJson
      })
      .select();

    if (error) {
      console.error('Error creating sponsored video:', error);
      return NextResponse.json({ error: 'Failed to create sponsored video' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sponsoredVideo: data[0],
      message: 'Sponsored video created successfully!'
    });

  } catch (error) {
    console.error('Sponsored videos API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');
    const active = searchParams.get('active') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('sponsored_videos')
      .select(`
        id,
        video_id,
        sponsor_name,
        placement,
        start_date,
        end_date,
        targeting_json,
        created_at,
        videos (
          id,
          title,
          description,
          thumbnail_url,
          creator_id,
          views,
          likes,
          profiles:creator_id (
            username,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (placement) {
      query = query.eq('placement', placement);
    }

    if (active) {
      const now = new Date().toISOString();
      query = query.lte('start_date', now).gte('end_date', now);
    }

    const { data: sponsoredVideos, error } = await query;

    if (error) {
      console.error('Error fetching sponsored videos:', error);
      return NextResponse.json({ error: 'Failed to fetch sponsored videos' }, { status: 500 });
    }

    const formattedSponsoredVideos = sponsoredVideos?.map(sv => ({
      id: sv.id,
      videoId: sv.video_id,
      sponsorName: sv.sponsor_name,
      placement: sv.placement,
      startDate: sv.start_date,
      endDate: sv.end_date,
      targetingJson: sv.targeting_json,
      createdAt: sv.created_at,
      video: sv.videos ? {
        id: (sv.videos as any).id,
        title: (sv.videos as any).title,
        description: (sv.videos as any).description,
        thumbnailUrl: (sv.videos as any).thumbnail_url,
        creatorId: (sv.videos as any).creator_id,
        views: (sv.videos as any).views,
        likes: (sv.videos as any).likes,
        creator: {
          username: ((sv.videos as any).profiles as any)?.username || 'Unknown',
          avatarUrl: ((sv.videos as any).profiles as any)?.avatar_url || ''
        }
      } : null,
      isActive: new Date(sv.start_date) <= new Date() && new Date(sv.end_date) >= new Date()
    })) || [];

    return NextResponse.json({
      sponsoredVideos: formattedSponsoredVideos,
      hasMore: sponsoredVideos?.length === limit
    });

  } catch (error) {
    console.error('Sponsored videos GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsoredVideoId = searchParams.get('id');

    if (!sponsoredVideoId) {
      return NextResponse.json({ error: 'Sponsored video ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('sponsored_videos')
      .delete()
      .eq('id', sponsoredVideoId);

    if (error) {
      console.error('Error deleting sponsored video:', error);
      return NextResponse.json({ error: 'Failed to delete sponsored video' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sponsored video deleted successfully!'
    });

  } catch (error) {
    console.error('Sponsored videos DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

