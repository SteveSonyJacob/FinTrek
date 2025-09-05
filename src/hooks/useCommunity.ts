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
        
        // Fetch discussions without requiring a join so missing profile rows don't fail the query
        const { data, error } = await supabase
          .from('discussions')
          .select(`*`)
          .order('is_pinned', { ascending: false })
          .order('updated_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Fetch related profiles for discussion authors
        const userIds = (data || []).map(d => d.user_id);
        const uniqueUserIds = Array.from(new Set(userIds));
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', uniqueUserIds);
        if (profilesError) throw profilesError;

        // Get reply and like counts, attach profiles
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
              profiles: (profilesData || []).filter(p => p.id === discussion.user_id),
              reply_count: repliesResult.count || 0,
              like_count: likesResult.count || 0
            } as Discussion;
          })
        );

        // Backfill author_name for older posts missing it
        const backfillPromises: Promise<any>[] = [];
        for (const d of discussionsWithCounts) {
          const needsBackfill = !(d as any).author_name || (d as any).author_name === '';
          if (needsBackfill) {
            const profile = (d as any).profiles?.[0];
            const fallbackName = profile?.name || `User ${(d as any).user_id?.slice(0, 8)}`;
            backfillPromises.push(
              supabase
                .from('discussions')
                .update({ author_name: fallbackName })
                .eq('id', (d as any).id)
            );
          }
        }
        if (backfillPromises.length > 0) {
          await Promise.allSettled(backfillPromises);
        }

        setDiscussions(discussionsWithCounts);
      } catch (err) {
        console.error('Failed to fetch discussions:', err);
        setError('Failed to fetch discussions');
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
      const authorName = (user.user_metadata as any)?.full_name || user.email || `User ${user.id.slice(0, 8)}`;
      
      const { data, error } = await supabase
        .from('discussions')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            category,
            author_name: authorName
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
        
        const [discussionsResult, weeklyResult, onlineProfiles] = await Promise.all([
          supabase
            .from('discussions')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('discussions')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          // Optional: count online members if you store presence (fallback 0 otherwise)
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('is_online', true)
        ]);

        setStats({
          activeMembers: onlineProfiles?.count || 0,
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