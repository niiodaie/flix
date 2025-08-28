import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const timeframe = searchParams.get('timeframe') || '7d'; // 1d, 7d, 30d, all
    const category = searchParams.get('category') || 'trending'; // trending, recent, popular

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
      `);

    // Apply timeframe filter
    if (timeframe !== 'all') {
      const daysAgo = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      query = query.gte('created_at', cutoffDate.toISOString());
    }

    // Apply category-based sorting
    switch (category) {
      case 'trending':
        // Trending algorithm: combination of views, likes, and recency
        // For now, we'll use a simple approach - in production, this would be more sophisticated
        query = query.order('views', { ascending: false }).order('likes', { ascending: false });
        break;
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('likes', { ascending: false }).order('views', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data: videos, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching explore videos:', error);
      return NextResponse.json({ error: 'Failed to fetch explore feed' }, { status: 500 });
    }

    // Get sponsored videos for this placement
    const { data: sponsoredVideos, error: sponsoredError } = await supabase
      .from('sponsored_videos')
      .select(`
        video_id,
        sponsor_name,
        placement,
        videos (
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
        )
      `)
      .eq('placement', 'explore')
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString());

    if (sponsoredError) {
      console.error('Error fetching sponsored videos:', sponsoredError);
    }

    // Format videos
    const formattedVideos = videos?.map(video => ({
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
      updatedAt: video.updated_at,
      isSponsored: false
    })) || [];

    // Format sponsored videos
    const formattedSponsoredVideos = sponsoredVideos?.map(sv => ({
      id: (sv.videos as any).id,
      title: (sv.videos as any).title,
      description: (sv.videos as any).description,
      thumbnailUrl: (sv.videos as any).thumbnail_url,
      videoUrl: (sv.videos as any).video_url,
      creatorId: (sv.videos as any).creator_id,
      creator: {
        username: ((sv.videos as any).profiles as any)?.username || 'Unknown',
        avatarUrl: ((sv.videos as any).profiles as any)?.avatar_url || ''
      },
      views: (sv.videos as any).views,
      likes: (sv.videos as any).likes,
      affiliateUrl: (sv.videos as any).affiliate_url,
      createdAt: (sv.videos as any).created_at,
      updatedAt: (sv.videos as any).updated_at,
      isSponsored: true,
      sponsorName: sv.sponsor_name
    })) || [];

    // Merge sponsored videos into the feed at strategic positions
    const mergedVideos = [...formattedVideos];
    formattedSponsoredVideos.forEach((sponsoredVideo, index) => {
      const insertPosition = Math.min((index + 1) * 5, mergedVideos.length); // Every 5th position
      mergedVideos.splice(insertPosition, 0, sponsoredVideo);
    });

    return NextResponse.json({
      videos: mergedVideos,
      hasMore: formattedVideos.length === limit,
      category,
      timeframe,
      totalSponsored: formattedSponsoredVideos.length
    });

  } catch (error) {
    console.error('Explore API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


