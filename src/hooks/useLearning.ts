import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: number;
  difficulty: string;
  estimated_time: string;
  topics: string[];
  order_index: number;
  is_unlocked: boolean;
  completed_lessons: number;
}

export const useLearningModules = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        
        const { data: modulesData, error: modulesError } = await supabase
          .from('learning_modules')
          .select('*')
          .order('order_index');

        if (modulesError) throw modulesError;

        let modulesWithProgress = modulesData || [];

        // If user is logged in, get their progress
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_module_progress')
            .select('module_id, completed_lessons')
            .eq('user_id', user.id);

          if (progressError && progressError.code !== 'PGRST116') {
            console.warn('Failed to fetch user progress:', progressError);
          }

          // Merge progress data with modules
          modulesWithProgress = modulesData?.map(module => {
            const userProgress = progressData?.find(p => p.module_id === module.id);
            return {
              ...module,
              completed_lessons: userProgress?.completed_lessons || 0
            };
          }) || [];
        } else {
          // Set completed lessons to 0 for non-authenticated users
          modulesWithProgress = modulesData?.map(module => ({
            ...module,
            completed_lessons: 0
          })) || [];
        }

        setModules(modulesWithProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch learning modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [user]);

  return { modules, loading, error };
};

export const useOverallProgress = () => {
  const [progress, setProgress] = useState({
    overallCompletion: 0,
    lessonsCompleted: 0,
    hoursStudied: 0
  });
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchOverallProgress = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setProgress({ overallCompletion: 0, lessonsCompleted: 0, hoursStudied: 0 });
          setLoading(false);
          return;
        }

        const [modulesResult, progressResult] = await Promise.all([
          supabase
            .from('learning_modules')
            .select('lessons'),
          supabase
            .from('user_module_progress')
            .select('completed_lessons')
            .eq('user_id', user.id)
        ]);

        const totalLessons = (modulesResult.data || []).reduce((sum, module) => sum + module.lessons, 0);
        const completedLessons = (progressResult.data || []).reduce((sum, progress) => sum + progress.completed_lessons, 0);
        
        const overallCompletion = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const hoursStudied = Math.round(completedLessons * 0.5); // Estimate 30 minutes per lesson

        setProgress({
          overallCompletion,
          lessonsCompleted: completedLessons,
          hoursStudied
        });
      } catch (err) {
        console.error('Failed to fetch overall progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallProgress();
  }, [user]);

  return { progress, loading };
};