import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface UserPoints {
  id: string;
  total_points: number;
  current_streak: number;
}

interface UserProgress {
  id: string;
  completed_lessons: number;
  total_lessons: number;
  current_level: string;
  next_level_progress: number;
}

interface QuizResult {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export const useUserPoints = () => {
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    if (!user) {
      setPoints(null);
      setLoading(false);
      return;
    }

    const fetchUserPoints = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('points')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          // Create initial points record for new user
          const { data: newData, error: insertError } = await supabase
            .from('points')
            .insert([
              {
                user_id: user.id,
                total_points: 0,
                current_streak: 0,
              }
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          setPoints(newData);
        } else {
          setPoints(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user points');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  return { points, loading, error };
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    const fetchUserProgress = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          // Create initial progress record for new user
          const { data: newData, error: insertError } = await supabase
            .from('progress')
            .insert([
              {
                user_id: user.id,
                completed_lessons: 0,
                total_lessons: 45,
                current_level: 'Beginner Trader',
                next_level_progress: 0,
              }
            ])
            .select()
            .single();

          if (insertError) throw insertError;
          setProgress(newData);
        } else {
          setProgress(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user progress');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user]);

  return { progress, loading, error };
};

export const useUserQuizResults = () => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    if (!user) {
      setQuizResults([]);
      setLoading(false);
      return;
    }

    const fetchQuizResults = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;
        setQuizResults(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [user]);

  return { quizResults, loading, error };
};