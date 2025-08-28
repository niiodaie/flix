// Supabase driver - placeholder implementation for future integration

import type { Repo, Video, Profile, SearchResult, FeedOptions } from '../types';

// TODO: Import Supabase client when ready
// import { supabase } from '../../supabaseClient';

class SupabaseRepo implements Repo {
  async getLensFeed(opts?: FeedOptions): Promise<Video[]> {
    // TODO: Implement LENS personalization algorithm with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async getTrending(opts?: FeedOptions): Promise<Video[]> {
    // TODO: Implement trending algorithm with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async getExplore(opts?: FeedOptions): Promise<Video[]> {
    // TODO: Implement explore feed with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async search(query: string): Promise<SearchResult> {
    // TODO: Implement search with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async getProfile(id: string): Promise<Profile | null> {
    // TODO: Implement profile fetching with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async getMyProfile(): Promise<Profile | null> {
    // TODO: Implement current user profile with Supabase Auth
    throw new Error('Supabase driver not implemented yet');
  }

  async updateMyProfile(patch: Partial<Profile>): Promise<void> {
    // TODO: Implement profile updates with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async like(videoId: string): Promise<void> {
    // TODO: Implement likes with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async unlike(videoId: string): Promise<void> {
    // TODO: Implement unlikes with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async comment(videoId: string, text: string): Promise<void> {
    // TODO: Implement comments with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async tip(videoId: string, amountCents: number): Promise<void> {
    // TODO: Implement tips with Stripe + Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async createDraft(meta: Partial<Video>): Promise<{ id: string }> {
    // TODO: Implement video upload with Supabase Storage
    throw new Error('Supabase driver not implemented yet');
  }

  async finalizeDraft(id: string): Promise<void> {
    // TODO: Implement draft finalization with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async trackView(videoId: string, dwellMs: number): Promise<void> {
    // TODO: Implement view tracking for LENS with Supabase
    throw new Error('Supabase driver not implemented yet');
  }

  async trackInteraction(videoId: string, type: 'like' | 'comment' | 'share'): Promise<void> {
    // TODO: Implement interaction tracking for LENS with Supabase
    throw new Error('Supabase driver not implemented yet');
  }
}

export const supabaseRepo = new SupabaseRepo();

