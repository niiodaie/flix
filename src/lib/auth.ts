import { supabase } from "@/lib/supabaseClient";

export const signInWithEmail = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};


