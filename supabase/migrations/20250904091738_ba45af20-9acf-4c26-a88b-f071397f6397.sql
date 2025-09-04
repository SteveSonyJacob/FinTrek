-- Create discussions table for community posts
CREATE TABLE public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Create policies for discussions
CREATE POLICY "Users can view all discussions" 
ON public.discussions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own discussions" 
ON public.discussions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" 
ON public.discussions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions" 
ON public.discussions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create discussion_replies table
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for discussion replies
CREATE POLICY "Users can view all discussion replies" 
ON public.discussion_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own replies" 
ON public.discussion_replies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" 
ON public.discussion_replies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" 
ON public.discussion_replies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create discussion_likes table
CREATE TABLE public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

-- Enable RLS
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for discussion likes
CREATE POLICY "Users can view all discussion likes" 
ON public.discussion_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own likes" 
ON public.discussion_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.discussion_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create learning_modules table
CREATE TABLE public.learning_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  color TEXT NOT NULL DEFAULT 'bg-gradient-primary',
  lessons INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  estimated_time TEXT NOT NULL DEFAULT '1 hour',
  topics TEXT[] NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

-- Create policies for learning modules (public read)
CREATE POLICY "Anyone can view learning modules" 
ON public.learning_modules 
FOR SELECT 
USING (true);

-- Create user_module_progress table
CREATE TABLE public.user_module_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user module progress
CREATE POLICY "Users can view their own module progress" 
ON public.user_module_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own module progress" 
ON public.user_module_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own module progress" 
ON public.user_module_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'bronze',
  icon TEXT NOT NULL DEFAULT 'award',
  points_required INTEGER,
  lessons_required INTEGER,
  streak_required INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_per_question INTEGER NOT NULL DEFAULT 50,
  time_limit INTEGER NOT NULL DEFAULT 300,
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE SET NULL,
  is_daily BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create policies for quizzes (public read)
CREATE POLICY "Anyone can view quizzes" 
ON public.quizzes 
FOR SELECT 
USING (true);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz questions (public read)
CREATE POLICY "Anyone can view quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Create user_activity table
CREATE TABLE public.user_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  activity_type TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for user activity
CREATE POLICY "Users can view their own activity" 
ON public.user_activity 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity" 
ON public.user_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at
BEFORE UPDATE ON public.discussion_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at
BEFORE UPDATE ON public.learning_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_module_progress_updated_at
BEFORE UPDATE ON public.user_module_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for learning modules
INSERT INTO public.learning_modules (title, description, icon, color, lessons, difficulty, estimated_time, topics, order_index) VALUES
('Financial Fundamentals', 'Master the basics of personal finance and money management', 'DollarSign', 'bg-gradient-primary', 8, 'Beginner', '2 hours', '{"Budgeting", "Saving", "Emergency Funds", "Financial Goals"}', 1),
('Investment Basics', 'Learn the fundamentals of investing and building wealth', 'TrendingUp', 'bg-gradient-success', 12, 'Beginner', '3 hours', '{"Stocks", "Bonds", "ETFs", "Risk Management"}', 2),
('Trading Strategies', 'Advanced trading techniques and market analysis', 'PieChart', 'bg-gradient-secondary', 15, 'Intermediate', '5 hours', '{"Technical Analysis", "Chart Patterns", "Day Trading", "Options"}', 3),
('Portfolio Management', 'Build and manage diversified investment portfolios', 'Briefcase', 'bg-accent', 10, 'Advanced', '4 hours', '{"Asset Allocation", "Rebalancing", "Risk Assessment", "Performance Analysis"}', 4);

-- Insert sample achievements
INSERT INTO public.achievements (title, description, type, icon, points_required, lessons_required, streak_required) VALUES
('First Steps', 'Complete first lesson', 'bronze', 'zap', NULL, 1, NULL),
('Week Warrior', '7-day learning streak', 'silver', 'star', NULL, NULL, 7),
('Quiz Master', 'Perfect score on 5 quizzes', 'gold', 'award', NULL, NULL, NULL),
('Knowledge Seeker', 'Complete 20 lessons', 'gold', 'crown', NULL, 20, NULL),
('Community Helper', 'Help 10 community members', 'silver', 'award', NULL, NULL, NULL),
('Finance Master', 'Complete all modules', 'diamond', 'crown', NULL, 45, NULL),
('Streak Legend', '30-day learning streak', 'gold', 'star', NULL, NULL, 30),
('Quiz Champion', 'Top 10% in weekly quiz', 'silver', 'award', NULL, NULL, NULL);

-- Insert sample daily quiz
INSERT INTO public.quizzes (title, description, points_per_question, time_limit, is_daily) VALUES
('Daily Financial Quiz', 'Test your knowledge and earn points!', 50, 300, true);

-- Get the quiz ID for inserting questions
INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index)
SELECT 
  q.id,
  'What percentage of your income should ideally go towards savings according to the 50/30/20 rule?',
  ARRAY['10%', '20%', '30%', '50%'],
  1,
  'The 50/30/20 rule suggests allocating 20% of your income towards savings and debt repayment.',
  0
FROM public.quizzes q WHERE q.is_daily = true;

INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index)
SELECT 
  q.id,
  'Which of the following is considered a "liquid" asset?',
  ARRAY['Real estate', 'Savings account', 'Retirement fund', 'Collectibles'],
  1,
  'A savings account is highly liquid because you can easily access your money without penalties or delays.',
  1
FROM public.quizzes q WHERE q.is_daily = true;

INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index)
SELECT 
  q.id,
  'What is the primary purpose of an emergency fund?',
  ARRAY['To invest in high-risk opportunities', 'To cover unexpected expenses', 'To buy luxury items', 'To pay regular monthly bills'],
  1,
  'An emergency fund is designed to cover unexpected expenses like medical bills, job loss, or major repairs.',
  2
FROM public.quizzes q WHERE q.is_daily = true;

INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index)
SELECT 
  q.id,
  'Which investment typically offers the highest potential returns over the long term?',
  ARRAY['Savings accounts', 'Government bonds', 'Stocks', 'Certificates of deposit (CDs)'],
  2,
  'Historically, stocks have provided the highest long-term returns, though they also come with higher risk.',
  3
FROM public.quizzes q WHERE q.is_daily = true;

INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index)
SELECT 
  q.id,
  'What does "diversification" mean in investing?',
  ARRAY['Putting all money in one stock', 'Spreading investments across different assets', 'Only investing in bonds', 'Keeping all money in cash'],
  1,
  'Diversification means spreading your investments across different asset types to reduce overall risk.',
  4
FROM public.quizzes q WHERE q.is_daily = true;