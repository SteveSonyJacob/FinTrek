import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    name?: string;
    avatar_url?: string;
  }[];
  reply_count: number;
  like_count: number;
}

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('discussions')
          .select(`
            id,
            title,
            content,
            category,
            is_pinned,
            created_at,
            updated_at,
            user_id,
            profiles!inner(name, avatar_url)
          `)
          .order('is_pinned', { ascending: false })
          .order('updated_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Get reply and like counts
        const discussionsWithCounts = await Promise.all(
          (data || []).map(async (discussion) => {
            const [repliesResult, likesResult] = await Promise.all([
              supabase
                .from('discussion_replies')
                .select('id', { count: 'exact', head: true })
                .eq('discussion_id', discussion.id),
              supabase
                .from('discussion_likes')
                .select('id', { count: 'exact', head: true })
                .eq('discussion_id', discussion.id)
            ]);

            return {
              ...discussion,
              reply_count: repliesResult.count || 0,
              like_count: likesResult.count || 0
            };
          })
        );

        setDiscussions(discussionsWithCounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('discussions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discussions'
        },
        () => {
          fetchDiscussions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { discussions, loading, error };
};

export const useCreateDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const createDiscussion = async (title: string, content: string, category: string = 'General') => {
    if (!user) throw new Error('User must be logged in to create discussions');

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('discussions')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            category
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create discussion');
    } finally {
      setLoading(false);
    }
  };

  return { createDiscussion, loading };
};

export const useCommunityStats = () => {
  const [stats, setStats] = useState({
    activeMembers: 0,
    totalDiscussions: 0,
    weeklyDiscussions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [discussionsResult, weeklyResult] = await Promise.all([
          supabase
            .from('discussions')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('discussions')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        setStats({
          activeMembers: 1247, // This would come from user analytics
          totalDiscussions: discussionsResult.count || 0,
          weeklyDiscussions: weeklyResult.count || 0
        });
      } catch (err) {
        console.error('Failed to fetch community stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};