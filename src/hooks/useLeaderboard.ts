import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  profiles: {
    name?: string;
    avatar_url?: string;
  }[];
}

interface UserRank {
  rank: number;
  total_points: number;
  current_streak: number;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Fetch top 10 leaderboard
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('points')
          .select(`
            id,
            user_id,
            total_points,
            current_streak,
            profiles!inner(name, avatar_url)
          `)
          .order('total_points', { ascending: false })
          .limit(10);

        if (leaderboardError) throw leaderboardError;
        setLeaderboard(leaderboardData || []);

        // Fetch current user's rank if logged in
        if (user) {
          const { data: userPoints, error: userError } = await supabase
            .from('points')
            .select('total_points, current_streak')
            .eq('user_id', user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            console.warn('User not found in points table:', userError);
            setUserRank(null);
          } else if (userPoints) {
            // Calculate user's rank
            const { count, error: countError } = await supabase
              .from('points')
              .select('*', { count: 'exact', head: true })
              .gt('total_points', userPoints.total_points);

            if (countError) throw countError;
            
            setUserRank({
              rank: (count || 0) + 1,
              total_points: userPoints.total_points,
              current_streak: userPoints.current_streak,
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up real-time subscription for leaderboard updates
    const subscription = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'points'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  return { leaderboard, userRank, loading, error };
};