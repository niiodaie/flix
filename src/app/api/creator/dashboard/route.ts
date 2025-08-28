import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json({ error: 'Creator ID is required' }, { status: 400 });
    }

    // Get creator's videos
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id, title, views, likes, created_at')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (videosError) {
      console.error('Error fetching creator videos:', videosError);
      return NextResponse.json({ error: 'Failed to fetch creator videos' }, { status: 500 });
    }

    const videoIds = videos?.map(v => v.id) || [];

    // Get total watch time from watch events
    const { data: watchEvents, error: watchError } = await supabase
      .from('watch_events')
      .select('video_id, dwell_ms, completed')
      .in('video_id', videoIds);

    if (watchError) {
      console.error('Error fetching watch events:', watchError);
    }

    // Get total tips received
    const { data: tips, error: tipsError } = await supabase
      .from('tips')
      .select('amount_cents, currency, created_at')
      .eq('to_user', creatorId);

    if (tipsError) {
      console.error('Error fetching tips:', tipsError);
    }

    // Get LENS recommendations count (videos shown in personalized feeds)
    const { data: lensViews, error: lensError } = await supabase
      .from('watch_events')
      .select('video_id')
      .in('video_id', videoIds);

    if (lensError) {
      console.error('Error fetching LENS views:', lensError);
    }

    // Calculate analytics
    const totalViews = videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0;
    const totalLikes = videos?.reduce((sum, video) => sum + (video.likes || 0), 0) || 0;
    const totalWatchTime = watchEvents?.reduce((sum, event) => sum + (event.dwell_ms || 0), 0) || 0;
    const totalTips = tips?.reduce((sum, tip) => sum + (tip.amount_cents || 0), 0) || 0;
    const completionRate = (watchEvents && watchEvents.length > 0)
      ? (watchEvents.filter(e => e.completed).length / watchEvents.length) * 100 
      : 0;
    const lensRecommendations = lensViews?.length || 0;

    // Get recent performance (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentVideos = videos?.filter(v => new Date(v.created_at) >= thirtyDaysAgo) || [];
    const recentTips = tips?.filter(t => new Date(t.created_at) >= thirtyDaysAgo) || [];

    // Video performance breakdown
    const videoPerformance = videos?.map(video => {
      const videoWatchEvents = watchEvents?.filter(e => e.video_id === video.id) || [];
      const videoWatchTime = videoWatchEvents.reduce((sum, e) => sum + (e.dwell_ms || 0), 0);
      const videoCompletionRate = videoWatchEvents.length > 0 
        ? (videoWatchEvents.filter(e => e.completed).length / videoWatchEvents.length) * 100 
        : 0;

      return {
        id: video.id,
        title: video.title,
        views: video.views,
        likes: video.likes,
        watchTime: videoWatchTime,
        completionRate: videoCompletionRate,
        createdAt: video.created_at
      };
    }) || [];

    // Monthly earnings breakdown
    const monthlyEarnings = tips?.reduce((acc, tip) => {
      const month = new Date(tip.created_at).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + tip.amount_cents;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      overview: {
        totalVideos: videos?.length || 0,
        totalViews,
        totalLikes,
        totalWatchTime: Math.round(totalWatchTime / 1000), // Convert to seconds
        totalTips: totalTips / 100, // Convert to dollars
        completionRate: Math.round(completionRate * 100) / 100,
        lensRecommendations
      },
      recent: {
        videosLast30Days: recentVideos.length,
        viewsLast30Days: recentVideos.reduce((sum, v) => sum + (v.views || 0), 0),
        tipsLast30Days: recentTips.reduce((sum, t) => sum + (t.amount_cents || 0), 0) / 100
      },
      videoPerformance: videoPerformance.slice(0, 10), // Top 10 recent videos
      monthlyEarnings,
      creatorId
    });

  } catch (error) {
    console.error('Creator dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

