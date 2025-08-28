import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromUser, toUser, videoId, amountCents, currency = 'USD', stripePaymentId } = body;

    if (!fromUser || !toUser || !amountCents) {
      return NextResponse.json({ 
        error: 'From user, to user, and amount are required' 
      }, { status: 400 });
    }

    if (amountCents < 50) { // Minimum $0.50
      return NextResponse.json({ 
        error: 'Minimum tip amount is $0.50' 
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Create a Stripe Payment Intent
    // 2. Process the payment
    // 3. Handle webhooks for payment confirmation
    // For now, we'll simulate a successful payment

    const { data, error } = await supabase
      .from('tips')
      .insert({
        from_user: fromUser,
        to_user: toUser,
        video_id: videoId,
        amount_cents: amountCents,
        currency,
        stripe_payment_id: stripePaymentId || `sim_${Date.now()}`
      })
      .select();

    if (error) {
      console.error('Error inserting tip:', error);
      return NextResponse.json({ error: 'Failed to process tip' }, { status: 500 });
    }

    // Update creator's total tips (this would typically be done via database triggers)
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      tip: data[0],
      message: 'Tip sent successfully!'
    });

  } catch (error) {
    console.error('Tips API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'sent' or 'received'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let query = supabase
      .from('tips')
      .select(`
        id,
        from_user,
        to_user,
        video_id,
        amount_cents,
        currency,
        created_at,
        videos (
          id,
          title,
          thumbnail_url
        ),
        from_profile:from_user (
          username,
          avatar_url
        ),
        to_profile:to_user (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type === 'sent') {
      query = query.eq('from_user', userId);
    } else if (type === 'received') {
      query = query.eq('to_user', userId);
    } else {
      // Get both sent and received
      query = query.or(`from_user.eq.${userId},to_user.eq.${userId}`);
    }

    const { data: tips, error } = await query;

    if (error) {
      console.error('Error fetching tips:', error);
      return NextResponse.json({ error: 'Failed to fetch tips' }, { status: 500 });
    }

    const formattedTips = tips?.map(tip => ({
      id: tip.id,
      fromUser: tip.from_user,
      toUser: tip.to_user,
      videoId: tip.video_id,
      amount: tip.amount_cents / 100, // Convert to dollars
      currency: tip.currency,
      createdAt: tip.created_at,
      video: tip.videos ? {
        id: (tip.videos as any).id,
        title: (tip.videos as any).title,
        thumbnailUrl: (tip.videos as any).thumbnail_url
      } : null,
      fromProfile: tip.from_profile ? {
        username: (tip.from_profile as any).username,
        avatarUrl: (tip.from_profile as any).avatar_url
      } : null,
      toProfile: tip.to_profile ? {
        username: (tip.to_profile as any).username,
        avatarUrl: (tip.to_profile as any).avatar_url
      } : null,
      type: tip.from_user === userId ? 'sent' : 'received'
    })) || [];

    return NextResponse.json({
      tips: formattedTips,
      hasMore: tips?.length === limit
    });

  } catch (error) {
    console.error('Tips GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

