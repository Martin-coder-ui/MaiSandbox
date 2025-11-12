import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Exception in fetchProfile:", err);
      setProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Re-fetch profile if auth state changes (e.g., login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });
    return () => subscription.unsubscribe();
  }, []);

  return { profile, loading };
}