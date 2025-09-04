import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold' | 'diamond';
  icon: string;
  earned: boolean;
  earned_at?: string;
}

interface UserActivity {
  id: string;
  activity: string;
  points: number;
  activity_type: string;
  created_at: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Fetch user points and progress
        const [pointsResult, progressResult] = await Promise.all([
          supabase
            .from('points')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('progress')
            .select('*')
            .eq('user_id', user.id)
            .single()
        ]);

        // Calculate quiz accuracy from quiz results
        const { data: quizResults } = await supabase
          .from('quiz_results')
          .select('score, total_questions')
          .eq('user_id', user.id);

        let quizAccuracy = 0;
        if (quizResults && quizResults.length > 0) {
          const totalQuestions = quizResults.reduce((sum, result) => sum + result.total_questions, 0);
          const totalCorrect = quizResults.reduce((sum, result) => sum + result.score, 0);
          quizAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        }

        const userProfile = {
          name: profileData?.name || user.email?.split('@')[0] || 'User',
          email: user.email,
          avatar: profileData?.avatar_url || '',
          joinDate: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          level: progressResult.data?.current_level || 'Beginner Trader',
          nextLevel: 'Advanced Trader', // This could be calculated based on progress
          levelProgress: progressResult.data?.next_level_progress || 0,
          totalPoints: pointsResult.data?.total_points || 0,
          currentStreak: pointsResult.data?.current_streak || 0,
          longestStreak: 12, // This would need to be tracked separately
          completedLessons: progressResult.data?.completed_lessons || 0,
          totalLessons: progressResult.data?.total_lessons || 45,
          quizzesTaken: quizResults?.length || 0,
          quizAccuracy,
          timeSpent: Math.round((progressResult.data?.completed_lessons || 0) * 0.5) // Estimate 30 min per lesson
        };

        setProfile(userProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
};

export const useUserAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setAchievements([]);
          setLoading(false);
          return;
        }

        // Get all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at');

        if (achievementsError) throw achievementsError;

        // Get user's earned achievements
        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id, earned_at')
          .eq('user_id', user.id);

        if (userAchievementsError && userAchievementsError.code !== 'PGRST116') {
          throw userAchievementsError;
        }

        // Merge data
        const achievementsWithStatus = (allAchievements || []).map(achievement => {
          const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
          return {
            ...achievement,
            earned: !!userAchievement,
            earned_at: userAchievement?.earned_at
          };
        });

        setAchievements(achievementsWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return { achievements, loading, error };
};

export const useUserActivity = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setActivities(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [user]);

  return { activities, loading, error };
};