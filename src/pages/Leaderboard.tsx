import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Badge from '@/components/gamification/Badge';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUserPoints, useUserProgress } from '@/hooks/useUserData';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Users,
  TrendingUp,
  Calendar,
  Flame,
  AlertCircle
} from 'lucide-react';

/**
 * Leaderboard page showing rankings and competitive elements
 * Features: Global and friends leaderboards, achievements, weekly challenges
 */
const Leaderboard = () => {
  const { leaderboard, userRank, loading, error } = useLeaderboard();
  const { points } = useUserPoints();
  const { progress } = useUserProgress();

  const weeklyChallenge = {
    title: 'Learning Streak Master',
    description: 'Complete lessons for 7 days straight',
    progress: progress ? progress.completed_lessons : 0,
    target: progress ? progress.total_lessons : 0,
    reward: points ? points.total_points : 0,
    endDate: '2 days left'
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-badge-gold" />;
      case 2: return <Medal className="w-5 h-5 text-badge-silver" />;
      case 3: return <Medal className="w-5 h-5 text-badge-bronze" />;
      default: return <Trophy className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBackground = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) return "bg-gradient-primary/10 border-primary shadow-button";
    switch (rank) {
      case 1: return "bg-gradient-to-r from-badge-gold/20 to-badge-gold/10 border-badge-gold/30";
      case 2: return "bg-gradient-to-r from-badge-silver/20 to-badge-silver/10 border-badge-silver/30";
      case 3: return "bg-gradient-to-r from-badge-bronze/20 to-badge-bronze/10 border-badge-bronze/30";
      default: return "bg-card border-border hover:bg-muted/50";
    }
  };

  const LeaderboardRow = ({ user, rank }: { user: any, rank: number }) => {
    const displayName = user.profiles?.[0]?.name || `User ${user.user_id.slice(0, 8)}`;
    const avatarUrl = user.profiles?.[0]?.avatar_url;
    
    return (
      <div className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${getRankBackground(rank)}`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 min-w-[60px]">
            {getRankIcon(rank)}
            <span className="font-bold text-lg">#{rank}</span>
          </div>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
              {displayName.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <span className="font-medium flex items-center space-x-2">
              <span>{displayName}</span>
            </span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Flame className="w-3 h-3 text-streak" />
                <span>{user.current_streak}d</span>
              </div>
            </div>
          </div>
        </div>
        
        <PointsDisplay points={user.total_points} size="sm" />
      </div>
    );
  };

  const renderLeaderboardSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compete with learners worldwide and track your progress against friends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="global" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="global" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Global</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Friends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Global Leaderboard</span>
                  </CardTitle>
                  <CardDescription>Top performers from around the world</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    renderLeaderboardSkeleton()
                  ) : error ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found in the leaderboard yet.
                    </div>
                  ) : (
                    leaderboard.map((user, index) => (
                      <LeaderboardRow key={user.id} user={user} rank={index + 1} />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="friends" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-accent" />
                    <span>Friends Leaderboard</span>
                  </CardTitle>
                  <CardDescription>Compete with your friends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-8 text-muted-foreground">
                    Friends feature coming soon!
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Invite Friends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Rank */}
          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Your Rank</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-6 w-24 mx-auto" />
                </>
              ) : error ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              ) : userRank ? (
                <>
                  <div className="text-3xl font-bold text-primary">#{userRank.rank}</div>
                  <p className="text-sm text-muted-foreground">Global Ranking</p>
                  <PointsDisplay points={userRank.total_points} size="lg" className="justify-center" />
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-streak">{userRank.current_streak}</div>
                      <div className="text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-success">+0</div>
                      <div className="text-muted-foreground">This Week</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">
                  Complete your first quiz to get ranked!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card className="shadow-card border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span>Weekly Challenge</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{weeklyChallenge.title}</h3>
                <p className="text-sm text-muted-foreground">{weeklyChallenge.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {weeklyChallenge.target > 0
                      ? `${weeklyChallenge.progress}/${weeklyChallenge.target}`
                      : '0/0'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weeklyChallenge.target > 0 ? (weeklyChallenge.progress / weeklyChallenge.target) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <PointsDisplay points={weeklyChallenge.reward} size="sm" className="text-white dark:text-white" />
                <span className="text-xs text-muted-foreground">{weeklyChallenge.endDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Achievers */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Achievement Showcase</CardTitle>
              <CardDescription>Recent top performers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Badge type="gold" title="Quiz Master" icon="crown" size="sm" />
                <Badge type="silver" title="Streak King" icon="star" size="sm" />
                <Badge type="diamond" title="Top Learner" icon="award" size="sm" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;