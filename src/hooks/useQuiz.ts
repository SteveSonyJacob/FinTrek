import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  points_per_question: number;
  time_limit: number;
  questions: QuizQuestion[];
}

export const useQuiz = (quizId?: string) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        
        let quizQuery = supabase.from('quizzes').select('*');
        
        if (quizId === 'daily') {
          quizQuery = quizQuery.eq('is_daily', true);
        } else if (quizId) {
          quizQuery = quizQuery.eq('id', quizId);
        } else {
          quizQuery = quizQuery.eq('is_daily', true);
        }
        
        const { data: quizData, error: quizError } = await quizQuery.single();

        if (quizError) throw quizError;

        // Fetch quiz questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizData.id)
          .order('order_index');

        if (questionsError) throw questionsError;

        setQuiz({
          ...quizData,
          questions: questionsData || []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  return { quiz, loading, error };
};

export const useSubmitQuizResult = () => {
  const [submitting, setSubmitting] = useState(false);
  const user = useUser();

  const submitQuizResult = async (quizId: string, score: number, totalQuestions: number) => {
    if (!user) throw new Error('User must be logged in to submit quiz results');

    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([
          {
            user_id: user.id,
            quiz_id: quizId,
            score,
            total_questions: totalQuestions
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Award points for correct answers
      const pointsEarned = score * 50; // 50 points per correct answer
      if (pointsEarned > 0) {
        const { error: pointsError } = await supabase.rpc('add_user_points', {
          user_id: user.id,
          points_to_add: pointsEarned
        });

        if (pointsError) {
          console.warn('Failed to award points:', pointsError);
        }

        // Log activity
        const { error: activityError } = await supabase
          .from('user_activity')
          .insert([
            {
              user_id: user.id,
              activity: score === totalQuestions ? 'Perfect score on quiz' : `Completed quiz with ${score}/${totalQuestions} correct`,
              points: pointsEarned,
              activity_type: 'quiz'
            }
          ]);

        if (activityError) {
          console.warn('Failed to log activity:', activityError);
        }
      }

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to submit quiz result');
    } finally {
      setSubmitting(false);
    }
  };

  return { submitQuizResult, submitting };
};