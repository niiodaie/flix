import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user's watch history and preferences
    const { data: watchEvents, error: watchError } = await supabase
      .from('watch_events')
      .select('video_id, completed, liked, commented, followed, dwell_ms')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (watchError) {
      console.error('Error fetching watch events:', watchError);
    }

    // Get user's liked videos for preference analysis
    const { data: likedVideos, error: likesError } = await supabase
      .from('likes')
      .select('video_id')
      .eq('user_id', userId);

    if (likesError) {
      console.error('Error fetching liked videos:', likesError);
    }

    // Get user's follows for creator preference
    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (followsError) {
      console.error('Error fetching follows:', followsError);
    }

    // Build personalized query based on user preferences
    let query = supabase
      .from('videos')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        video_url,
        creator_id,
        views,
        likes,
        affiliate_url,
        created_at,
        updated_at,
        profiles:creator_id (
          username,
          avatar_url
        )
      `)
      .neq('creator_id', userId) // Exclude user's own videos
      .order('created_at', { ascending: false });

    // Apply personalization filters
    const watchedVideoIds = watchEvents?.map(we => we.video_id) || [];
    const likedVideoIds = likedVideos?.map(lv => lv.video_id) || [];
    const followedCreatorIds = follows?.map(f => f.following_id) || [];

    // Exclude already watched videos
    if (watchedVideoIds.length > 0) {
      query = query.not('id', 'in', `(${watchedVideoIds.join(',')})`);
    }

    // Prioritize videos from followed creators
    if (followedCreatorIds.length > 0) {
      const { data: followedCreatorVideos, error: followedError } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          video_url,
          creator_id,
          views,
          likes,
          affiliate_url,
          created_at,
          updated_at,
          profiles:creator_id (
            username,
            avatar_url
          )
        `)
        .in('creator_id', followedCreatorIds)
        .not('id', 'in', watchedVideoIds.length > 0 ? `(${watchedVideoIds.join(',')})` : '()')
        .order('created_at', { ascending: false })
        .limit(Math.floor(limit / 2));

      if (!followedError && followedCreatorVideos) {
        // Get remaining videos from general feed
        const remainingLimit = limit - followedCreatorVideos.length;
        const { data: generalVideos, error: generalError } = await query
          .not('creator_id', 'in', `(${followedCreatorIds.join(',')})`)
          .range(offset, offset + remainingLimit - 1);

        if (!generalError && generalVideos) {
          const combinedVideos = [...followedCreatorVideos, ...generalVideos];
          return NextResponse.json({
            videos: combinedVideos.map(video => ({
              id: video.id,
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnail_url,
              videoUrl: video.video_url,
              creatorId: video.creator_id,
              creator: {
                username: (video.profiles as any)?.username || 'Unknown',
                avatarUrl: (video.profiles as any)?.avatar_url || ''
              },
              views: video.views,
              likes: video.likes,
              affiliateUrl: video.affiliate_url,
              createdAt: video.created_at,
              updatedAt: video.updated_at
            })),
            hasMore: combinedVideos.length === limit,
            algorithm: 'lens_personalized'
          });
        }
      }
    }

    // Fallback to general personalized feed
    const { data: videos, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: 'Failed to fetch personalized feed' }, { status: 500 });
    }

    return NextResponse.json({
      videos: videos?.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnail_url,
        videoUrl: video.video_url,
        creatorId: video.creator_id,
        creator: {
          username: (video.profiles as any)?.username || 'Unknown',
          avatarUrl: (video.profiles as any)?.avatar_url || ''
        },
        views: video.views,
        likes: video.likes,
        affiliateUrl: video.affiliate_url,
        createdAt: video.created_at,
        updatedAt: video.updated_at
      })) || [],
      hasMore: videos?.length === limit,
      algorithm: 'lens_basic'
    });

  } catch (error) {
    console.error('LENS API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST endpoint for tracking watch events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, videoId, dwellMs, completed, liked, commented, followed } = body;

    if (!userId || !videoId) {
      return NextResponse.json({ error: 'User ID and Video ID are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('watch_events')
      .insert({
        user_id: userId,
        video_id: videoId,
        dwell_ms: dwellMs || 0,
        completed: completed || false,
        liked: liked || false,
        commented: commented || false,
        followed: followed || false
      })
      .select();

    if (error) {
      console.error('Error inserting watch event:', error);
      return NextResponse.json({ error: 'Failed to track watch event' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Watch event tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


