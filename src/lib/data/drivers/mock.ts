// Mock driver - uses JSON files and localStorage for data persistence

import type { Repo, Video, Profile, SearchResult, FeedOptions, Comment } from '../types';

// Import mock data
import videosData from '../../../mocks/videos.json';
import profilesData from '../../../mocks/profiles.json';
import commentsData from '../../../mocks/comments.json';

// Type the imported data
const videos = videosData as Video[];
const profiles = profilesData as Profile[];
const comments = commentsData as Comment[];

// Demo user ID for local session
const DEMO_USER_ID = 'user_demo';

// LocalStorage keys
const STORAGE_KEYS = {
  LIKES: 'flix_likes',
  COMMENTS: 'flix_comments',
  VIEWS: 'flix_views',
  INTERACTIONS: 'flix_interactions',
  PROFILE: 'flix_profile',
  DRAFTS: 'flix_drafts'
};

class MockRepo implements Repo {
  private getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getPersonalizedFeed(): Video[] {
    // Simple personalization based on user interactions
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    const likedTags = new Set<string>();
    
    // Extract tags from liked videos
    Object.keys(interactions).forEach(videoId => {
      const video = videos.find(v => v.id === videoId);
      if (video && interactions[videoId]?.liked) {
        video.tags.forEach(tag => likedTags.add(tag));
      }
    });

    // Score videos based on tag matches
    const scoredVideos = videos.map(video => {
      let score = Math.random(); // Base randomness
      
      // Boost score for videos with liked tags
      video.tags.forEach(tag => {
        if (likedTags.has(tag)) {
          score += 0.3;
        }
      });

      // Boost newer content slightly
      const daysSinceCreated = (Date.now() - new Date(video.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 7) {
        score += 0.1;
      }

      return { video, score };
    });

    // Sort by score and return videos
    return scoredVideos
      .sort((a, b) => b.score - a.score)
      .map(item => item.video);
  }

  async getLensFeed(opts?: FeedOptions): Promise<Video[]> {
    const limit = opts?.limit || 20;
    const personalizedVideos = this.getPersonalizedFeed();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return personalizedVideos.slice(0, limit);
  }

  async getTrending(opts?: FeedOptions): Promise<Video[]> {
    const limit = opts?.limit || 20;
    
    // Sort by views and recent activity
    const trending = [...videos].sort((a, b) => {
      const aScore = a.views + (a.likes * 10);
      const bScore = b.views + (b.likes * 10);
      return bScore - aScore;
    });

    await new Promise(resolve => setTimeout(resolve, 200));
    return trending.slice(0, limit);
  }

  async getExplore(opts?: FeedOptions): Promise<Video[]> {
    const limit = opts?.limit || 20;
    
    // Mix of trending and random content
    const shuffled = this.shuffleArray(videos);
    
    await new Promise(resolve => setTimeout(resolve, 250));
    return shuffled.slice(0, limit);
  }

  async search(query: string): Promise<SearchResult> {
    const lowerQuery = query.toLowerCase();
    
    const matchingVideos = videos.filter(video => 
      video.title.toLowerCase().includes(lowerQuery) ||
      video.desc.toLowerCase().includes(lowerQuery) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    const matchingCreators = profiles.filter(profile =>
      profile.name.toLowerCase().includes(lowerQuery) ||
      profile.handle.toLowerCase().includes(lowerQuery) ||
      profile.bio?.toLowerCase().includes(lowerQuery)
    );

    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      videos: matchingVideos,
      creators: matchingCreators
    };
  }

  async getProfile(id: string): Promise<Profile | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return profiles.find(p => p.id === id) || null;
  }

  async getMyProfile(): Promise<Profile | null> {
    // Check if user has customized their profile
    const customProfile = this.getFromStorage(STORAGE_KEYS.PROFILE, null);
    if (customProfile) {
      return customProfile;
    }

    // Return demo user profile
    await new Promise(resolve => setTimeout(resolve, 100));
    return profiles.find(p => p.id === DEMO_USER_ID) || null;
  }

  async updateMyProfile(patch: Partial<Profile>): Promise<void> {
    const currentProfile = await this.getMyProfile();
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...patch };
      this.setToStorage(STORAGE_KEYS.PROFILE, updatedProfile);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  async like(videoId: string): Promise<void> {
    const likes = this.getFromStorage(STORAGE_KEYS.LIKES, [] as string[]);
    if (!likes.includes(videoId)) {
      likes.push(videoId);
      this.setToStorage(STORAGE_KEYS.LIKES, likes);
    }

    // Track interaction for personalization
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    interactions[videoId] = { ...interactions[videoId], liked: true };
    this.setToStorage(STORAGE_KEYS.INTERACTIONS, interactions);

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async unlike(videoId: string): Promise<void> {
    const likes = this.getFromStorage(STORAGE_KEYS.LIKES, [] as string[]);
    const updatedLikes = likes.filter((id: string) => id !== videoId);
    this.setToStorage(STORAGE_KEYS.LIKES, updatedLikes);

    // Update interaction tracking
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    if (interactions[videoId]) {
      interactions[videoId].liked = false;
      this.setToStorage(STORAGE_KEYS.INTERACTIONS, interactions);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async comment(videoId: string, text: string): Promise<void> {
    const userComments = this.getFromStorage(STORAGE_KEYS.COMMENTS, [] as Comment[]);
    const newComment = {
      id: `comment_${Date.now()}`,
      videoId,
      userId: DEMO_USER_ID,
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    userComments.push(newComment);
    this.setToStorage(STORAGE_KEYS.COMMENTS, userComments);

    // Track interaction
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    interactions[videoId] = { ...interactions[videoId], commented: true };
    this.setToStorage(STORAGE_KEYS.INTERACTIONS, interactions);

    await new Promise(resolve => setTimeout(resolve, 150));
  }

  async tip(videoId: string, amountCents: number): Promise<void> {
    // In mock mode, just show a success message
    console.log(`💰 Mock tip: $${amountCents / 100} sent for video ${videoId}`);
    
    // Track interaction
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    interactions[videoId] = { ...interactions[videoId], tipped: true };
    this.setToStorage(STORAGE_KEYS.INTERACTIONS, interactions);

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  async createDraft(meta: Partial<Video>): Promise<{ id: string }> {
    const draftId = `draft_${Date.now()}`;
    const drafts = this.getFromStorage(STORAGE_KEYS.DRAFTS, {} as Record<string, any>);
    
    drafts[draftId] = {
      id: draftId,
      ownerId: DEMO_USER_ID,
      title: meta.title || 'Untitled Video',
      desc: meta.desc || '',
      tags: meta.tags || [],
      thumbUrl: meta.thumbUrl || '',
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      duration: meta.duration || 0,
      status: 'draft'
    };
    
    this.setToStorage(STORAGE_KEYS.DRAFTS, drafts);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { id: draftId };
  }

  async finalizeDraft(id: string): Promise<void> {
    const drafts = this.getFromStorage(STORAGE_KEYS.DRAFTS, {} as Record<string, any>);
    if (drafts[id]) {
      drafts[id].status = 'published';
      this.setToStorage(STORAGE_KEYS.DRAFTS, drafts);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async trackView(videoId: string, dwellMs: number): Promise<void> {
    const views = this.getFromStorage(STORAGE_KEYS.VIEWS, {} as Record<string, number>);
    views[videoId] = (views[videoId] || 0) + 1;
    this.setToStorage(STORAGE_KEYS.VIEWS, views);

    // Track for personalization
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    interactions[videoId] = { 
      ...interactions[videoId], 
      viewed: true, 
      dwellMs: Math.max(interactions[videoId]?.dwellMs || 0, dwellMs)
    };
    this.setToStorage(STORAGE_KEYS.INTERACTIONS, interactions);

    // No network delay for view tracking
  }

  async trackInteraction(videoId: string, type: 'like' | 'comment' | 'share'): Promise<void> {
    const interactions = this.getFromStorage(STORAGE_KEYS.INTERACTIONS, {} as Record<string, any>);
    interactions[videoId] = { 
      ...interactions[videoId], 
      [type]: true,
      lastInteraction: new Date().toISOString()
    };
    this.setToStorage(STORAGE_KEYS.INTERACTIONS, interactions);
  }

  // Helper method to check if user has liked a video
  hasLiked(videoId: string): boolean {
    const likes = this.getFromStorage(STORAGE_KEYS.LIKES, [] as string[]);
    return likes.includes(videoId);
  }

  // Helper method to get user's comments for a video
  getUserComments(videoId: string): Comment[] {
    const userComments = this.getFromStorage(STORAGE_KEYS.COMMENTS, [] as Comment[]);
    return userComments.filter((comment: Comment) => comment.videoId === videoId);
  }
}

export const mockRepo = new MockRepo();

