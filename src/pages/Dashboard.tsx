import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProgressBar from '@/components/gamification/ProgressBar';
import Badge from '@/components/gamification/Badge';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { useUser } from '@supabase/auth-helpers-react';
import { useUserPoints, useUserProgress, useUserQuizResults } from '@/hooks/useUserData';
import { useUserAchievements } from '@/hooks/useProfile';
import { useMemo } from 'react';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  Award,
  Users,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Main dashboard page displaying user progress, achievements, and quick actions
 * Features: Progress overview, recent badges, learning streaks, quick navigation
 */
const Dashboard = () => {
  const user = useUser();
  const { points, loading: pointsLoading, error: pointsError } = useUserPoints();
  const { progress, loading: progressLoading, error: progressError } = useUserProgress();
  const { quizResults, loading: quizLoading, error: quizError } = useUserQuizResults();
  const { achievements, loading: achievementsLoading } = useUserAchievements();

  // Calculate quiz accuracy from recent results
  const quizAccuracy = quizResults.length > 0 
    ? Math.round((quizResults.reduce((acc, result) => acc + (result.score / result.total_questions * 100), 0) / quizResults.length))
    : 0;

  // Weekly activity: mark the most recent N days complete based on current streak (bounded by 7)
  const weeklyProgress = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const streak = Math.max(0, Math.min(7, points?.current_streak || 0));
    const todayIdx = new Date().getDay(); // 0..6 (Sun..Sat)
    const completedSet = new Set<number>();
    for (let i = 0; i < streak; i++) {
      const idx = (todayIdx - i + 7) % 7; // mark backwards from today
      completedSet.add(idx);
    }
    return days.map((day, idx) => ({
      day,
      completed: completedSet.has(idx)
    }));
  }, [points]);

  // Get recent earned achievements (limit to 3 for display)
  const recentBadges = useMemo(() => {
    if (achievementsLoading || !achievements) return [];
    return achievements
      .filter(achievement => achievement.earned)
      .slice(0, 3)
      .map(achievement => ({
        type: (achievement.type as 'gold' | 'silver' | 'bronze' | 'diamond'),
        title: achievement.title,
        icon: (achievement.icon as 'award' | 'star' | 'crown' | 'zap')
      }));
  }, [achievements, achievementsLoading]);

  const renderLoadingCard = () => (
    <Card className="bg-gradient-card shadow-card border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-12" />
      </CardContent>
    </Card>
  );

  const renderErrorCard = (title: string, error: string) => (
    <Card className="bg-gradient-card shadow-card border-destructive/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <AlertCircle className="h-4 w-4 text-destructive" />
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Welcome Back, {user?.user_metadata?.full_name || user?.email}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You're on fire! Keep up the momentum and continue your journey to financial mastery.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Points Card */}
        {pointsLoading ? renderLoadingCard() : pointsError ? renderErrorCard("Total Points", pointsError) : (
          <Card className="bg-gradient-card shadow-card border-primary/20 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <PointsDisplay points={points?.total_points || 0} size="lg" />
              <p className="text-xs text-success mt-2">+15 today</p>
            </CardContent>
          </Card>
        )}

        {/* Current Streak Card */}
        {pointsLoading ? renderLoadingCard() : pointsError ? renderErrorCard("Current Streak", pointsError) : (
          <Card className="bg-gradient-card shadow-card border-streak/20 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-streak" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-streak">{points?.current_streak || 0} days</div>
              <p className="text-xs text-muted-foreground mt-2">Personal best: 12 days</p>
            </CardContent>
          </Card>
        )}

        {/* Lessons Completed Card */}
        {progressLoading ? renderLoadingCard() : progressError ? renderErrorCard("Lessons Completed", progressError) : (
          <Card className="bg-gradient-card shadow-card border-accent/20 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress?.completed_lessons || 0}/{progress?.total_lessons || 45}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {progress ? Math.round((progress.completed_lessons / progress.total_lessons) * 100) : 0}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Current Level Card */}
        {progressLoading ? renderLoadingCard() : progressError ? renderErrorCard("Current Level", progressError) : (
          <Card className="bg-gradient-card shadow-card border-secondary/20 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Award className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{progress?.current_level || 'Beginner Trader'}</div>
              <p className="text-xs text-muted-foreground mt-2">Next: Advanced Trader</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Section */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : progressError ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{progressError}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <ProgressBar
                    progress={progress ? (progress.completed_lessons / progress.total_lessons) * 100 : 0}
                    label="Overall Course Progress"
                    variant="primary"
                    showPercentage
                    animated
                  />
                  <ProgressBar
                    progress={progress?.next_level_progress || 0}
                    label="Progress to Next Level"
                    variant="xp"
                    showPercentage
                    animated
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span>Weekly Activity</span>
              </CardTitle>
              <CardDescription>Keep your streak alive!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between space-x-2">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      day.completed 
                        ? 'bg-gradient-success text-white shadow-badge' 
                        : 'bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30'
                    }`}>
                      {day.completed ? '✓' : '○'}
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Achievements */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/quiz/daily">
                <Button className="w-full bg-gradient-primary hover:scale-105 transition-transform shadow-button">
                  <Play className="w-4 h-4 mr-2" />
                  Take Daily Quiz
                </Button>
              </Link>
              <Link to="/learning">
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Join Discussion
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-secondary" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievementsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : recentBadges.length > 0 ? (
                <>
                  <div className="flex justify-center space-x-4">
                    {recentBadges.map((badge, index) => (
                      <Badge
                        key={index}
                        type={badge.type}
                        title={badge.title}
                        icon={badge.icon}
                        size="md"
                        earned
                      />
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Link to="/profile">
                      <Button variant="ghost" size="sm">
                        View All Badges →
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No achievements yet. Start learning to earn your first badge!</p>
                  <Link to="/learning">
                    <Button variant="outline" size="sm" className="mt-2">
                      Start Learning
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;