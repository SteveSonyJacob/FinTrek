import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Badge from '@/components/gamification/Badge';
import ProgressBar from '@/components/gamification/ProgressBar';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { 
  User, 
  Edit3, 
  Calendar,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Flame,
  Settings,
  Share2
} from 'lucide-react';

/**
 * User profile page with achievements, stats, and settings
 * Features: Profile editing, achievement showcase, learning statistics, progress tracking
 */
const Profile = () => {
  // Mock user data - replace with real API calls
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: '',
    joinDate: 'March 2024',
    level: 'Intermediate Trader',
    nextLevel: 'Advanced Trader',
    levelProgress: 68,
    totalPoints: 2847,
    currentStreak: 7,
    longestStreak: 12,
    completedLessons: 24,
    totalLessons: 45,
    quizzesTaken: 32,
    correctAnswers: 186,
    totalAnswers: 240,
    timeSpent: 12.5 // hours
  };

  const achievements = [
    { type: 'gold' as const, title: 'Quiz Master', description: 'Perfect score on 5 quizzes', icon: 'award' as const, earned: true },
    { type: 'silver' as const, title: 'Week Warrior', description: '7-day learning streak', icon: 'star' as const, earned: true },
    { type: 'bronze' as const, title: 'First Steps', description: 'Complete first lesson', icon: 'zap' as const, earned: true },
    { type: 'gold' as const, title: 'Knowledge Seeker', description: 'Complete 20 lessons', icon: 'crown' as const, earned: true },
    { type: 'silver' as const, title: 'Community Helper', description: 'Help 10 community members', icon: 'award' as const, earned: true },
    { type: 'diamond' as const, title: 'Finance Master', description: 'Complete all modules', icon: 'crown' as const, earned: false },
    { type: 'gold' as const, title: 'Streak Legend', description: '30-day learning streak', icon: 'star' as const, earned: false },
    { type: 'silver' as const, title: 'Quiz Champion', description: 'Top 10% in weekly quiz', icon: 'award' as const, earned: false }
  ];

  const recentActivity = [
    { 
      date: new Date(), 
      activity: 'Completed lesson "Investment Basics"', 
      points: 50, 
      type: 'lesson' 
    },
    { 
      date: new Date(Date.now() - 1 * 60 * 60 * 1000), 
      activity: 'Perfect score on Daily Quiz', 
      points: 100, 
      type: 'quiz' 
    },
    { 
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), 
      activity: 'Started "Trading Strategies" module', 
      points: 25, 
      type: 'milestone' 
    },
    { 
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
      activity: 'Earned "Week Warrior" badge', 
      points: 200, 
      type: 'achievement' 
    }
  ];

  const learningGoals = [
    { title: 'Complete Investment Basics', progress: 75, target: 'This week' },
    { title: 'Maintain 14-day streak', progress: 50, target: '7 days left' },
    { title: 'Score 90%+ on next quiz', progress: 0, target: 'Next quiz' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-4 h-4 text-primary" />;
      case 'quiz': return <Target className="w-4 h-4 text-secondary" />;
      case 'achievement': return <Award className="w-4 h-4 text-badge-gold" />;
      default: return <TrendingUp className="w-4 h-4 text-accent" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card className="shadow-glow border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar and Basic Info */}
            <div className="text-center md:text-left">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 shadow-badge border-4 border-white">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 rounded-full p-2 w-8 h-8 bg-gradient-secondary shadow-badge"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-muted-foreground">{userData.email}</p>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="text-center p-4 bg-gradient-card rounded-lg border shadow-card">
                <PointsDisplay points={userData.totalPoints} size="sm" className="justify-center mb-1" />
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-card rounded-lg border shadow-card">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Flame className="w-4 h-4 text-streak" />
                  <span className="font-bold text-streak">{userData.currentStreak}</span>
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-card rounded-lg border shadow-card">
                <div className="font-bold text-primary text-lg">{userData.completedLessons}</div>
                <div className="text-xs text-muted-foreground">Lessons Done</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-card rounded-lg border shadow-card">
                <div className="font-bold text-secondary text-lg">{Math.round((userData.correctAnswers / userData.totalAnswers) * 100)}%</div>
                <div className="text-xs text-muted-foreground">Quiz Accuracy</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{userData.level}</span>
              <span className="text-sm text-muted-foreground">Next: {userData.nextLevel}</span>
            </div>
            <ProgressBar
              progress={userData.levelProgress}
              variant="xp"
              showPercentage
              animated
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="activity">
            <TrendingUp className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Earned Achievements</CardTitle>
                <CardDescription>Badges you've unlocked on your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {achievements.filter(badge => badge.earned).map((badge, index) => (
                    <Badge
                      key={index}
                      type={badge.type}
                      title={badge.title}
                      description={badge.description}
                      icon={badge.icon}
                      earned={badge.earned}
                      size="md"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Upcoming Achievements</CardTitle>
                <CardDescription>Badges you can earn next</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {achievements.filter(badge => !badge.earned).map((badge, index) => (
                    <Badge
                      key={index}
                      type={badge.type}
                      title={badge.title}
                      description={badge.description}
                      icon={badge.icon}
                      earned={badge.earned}
                      size="md"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Achievement Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-badge-gold">{achievements.filter(a => a.earned && a.type === 'gold').length}</div>
                <div className="text-sm text-muted-foreground">Gold Badges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-badge-silver">{achievements.filter(a => a.earned && a.type === 'silver').length}</div>
                <div className="text-sm text-muted-foreground">Silver Badges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-badge-bronze">{achievements.filter(a => a.earned && a.type === 'bronze').length}</div>
                <div className="text-sm text-muted-foreground">Bronze Badges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-badge-diamond">{achievements.filter(a => a.earned && a.type === 'diamond').length}</div>
                <div className="text-sm text-muted-foreground">Diamond Badges</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your learning progress over the past few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <p className="font-medium">{activity.activity}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                    <PointsDisplay points={activity.points} size="sm" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>Track your progress towards your learning objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {learningGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-sm text-muted-foreground">{goal.target}</span>
                  </div>
                  <ProgressBar
                    progress={goal.progress}
                    variant="primary"
                    showPercentage
                    animated
                  />
                </div>
              ))}
              
              <Button className="w-full bg-gradient-primary">
                <Target className="w-4 h-4 mr-2" />
                Set New Goal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={userData.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={userData.email} />
                </div>
                <Button className="w-full bg-gradient-primary">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Reminders</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email Notifications</span>
                    <Button variant="outline" size="sm">On</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Public Profile</span>
                    <Button variant="outline" size="sm">Private</Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;