// Data layer factory - selects driver based on environment flags

import type { Repo } from './types';

// Check if Supabase is enabled via environment variable
const useSupabase = process.env.NEXT_PUBLIC_ENABLE_SUPABASE === 'true';

// Log the current data layer mode
if (typeof window !== 'undefined') {
  console.log(`🔧 FLIX Data Layer: ${useSupabase ? 'Supabase' : 'Mock'} mode`);
}

// Dynamic import to ensure tree-shaking works properly
let repo: Repo;

if (useSupabase) {
  // Only import Supabase driver if enabled
  const { supabaseRepo } = require('./drivers/supabase');
  repo = supabaseRepo;
} else {
  // Default to mock driver
  const { mockRepo } = require('./drivers/mock');
  repo = mockRepo;
}

export { repo };
export * from './types';

