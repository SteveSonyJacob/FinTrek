import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/gamification/ProgressBar';
import Badge from '@/components/gamification/Badge';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  Award,
  Users,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Main dashboard page displaying user progress, achievements, and quick actions
 * Features: Progress overview, recent badges, learning streaks, quick navigation
 */
const Dashboard = () => {
  // Mock data - replace with real API calls
  const userStats = {
    totalPoints: 2847,
    currentStreak: 7,
    completedLessons: 24,
    totalLessons: 45,
    currentLevel: 'Intermediate Trader',
    nextLevelProgress: 68,
    recentBadges: [
      { type: 'gold' as const, title: 'Quiz Master', icon: 'award' as const },
      { type: 'silver' as const, title: 'Week Warrior', icon: 'star' as const },
      { type: 'bronze' as const, title: 'First Steps', icon: 'zap' as const }
    ]
  };

  const weeklyProgress = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Welcome Back, Sarah! 🚀
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You're on fire! Keep up the momentum and continue your journey to financial mastery.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-primary/20 hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <PointsDisplay points={userStats.totalPoints} size="lg" />
            <p className="text-xs text-success mt-2">+150 today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-streak/20 hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-streak" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-streak">{userStats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground mt-2">Personal best: 12 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-accent/20 hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedLessons}/{userStats.totalLessons}</div>
            <p className="text-xs text-muted-foreground mt-2">53% complete</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-secondary/20 hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Award className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{userStats.currentLevel}</div>
            <p className="text-xs text-muted-foreground mt-2">Next: Advanced Trader</p>
          </CardContent>
        </Card>
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
              <ProgressBar
                progress={(userStats.completedLessons / userStats.totalLessons) * 100}
                label="Overall Course Progress"
                variant="primary"
                showPercentage
                animated
              />
              <ProgressBar
                progress={userStats.nextLevelProgress}
                label="Progress to Next Level"
                variant="xp"
                showPercentage
                animated
              />
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
              <div className="flex justify-center space-x-4">
                {userStats.recentBadges.map((badge, index) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;