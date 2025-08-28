import { useState, useEffect } from "react";
import { getCurrentUser, signInWithEmail, signOut } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    const { data, error } = await signInWithEmail(email);
    setLoading(false);
    if (data) setUser(data.user);
    return { data, error };
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await signOut();
    setLoading(false);
    if (!error) setUser(null);
    return { error };
  };

  return { user, loading, login, logout };
}


