import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Badge from '@/components/gamification/Badge';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Users,
  TrendingUp,
  Calendar,
  Flame
} from 'lucide-react';

/**
 * Leaderboard page showing rankings and competitive elements
 * Features: Global and friends leaderboards, achievements, weekly challenges
 */
const Leaderboard = () => {
  // Mock data - replace with real API calls
  const globalLeaderboard = [
    {
      id: 1,
      rank: 1,
      name: 'Alex Chen',
      avatar: '',
      points: 15420,
      badge: 'gold',
      streak: 45,
      weeklyPoints: 680
    },
    {
      id: 2,
      rank: 2,
      name: 'Maria Rodriguez',
      avatar: '',
      points: 14870,
      badge: 'gold',
      streak: 32,
      weeklyPoints: 520
    },
    {
      id: 3,
      rank: 3,
      name: 'David Kim',
      avatar: '',
      points: 13950,
      badge: 'silver',
      streak: 28,
      weeklyPoints: 460
    },
    {
      id: 4,
      rank: 4,
      name: 'Sarah Johnson',
      avatar: '',
      points: 13240,
      badge: 'silver',
      streak: 23,
      weeklyPoints: 380
    },
    {
      id: 5,
      rank: 5,
      name: 'You',
      avatar: '',
      points: 2847,
      badge: 'bronze',
      streak: 7,
      weeklyPoints: 180,
      isCurrentUser: true
    }
  ];

  const friendsLeaderboard = [
    {
      id: 1,
      rank: 1,
      name: 'Emma Wilson',
      avatar: '',
      points: 4520,
      badge: 'silver',
      streak: 15,
      weeklyPoints: 240
    },
    {
      id: 2,
      rank: 2,
      name: 'You',
      avatar: '',
      points: 2847,
      badge: 'bronze',
      streak: 7,
      weeklyPoints: 180,
      isCurrentUser: true
    },
    {
      id: 3,
      rank: 3,
      name: 'John Smith',
      avatar: '',
      points: 2340,
      badge: 'bronze',
      streak: 12,
      weeklyPoints: 160
    }
  ];

  const weeklyChallenge = {
    title: 'Learning Streak Master',
    description: 'Complete lessons for 7 days straight',
    progress: 5,
    target: 7,
    reward: 500,
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

  const LeaderboardRow = ({ user, showWeeklyPoints = false }: { user: any, showWeeklyPoints?: boolean }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${getRankBackground(user.rank, user.isCurrentUser)}`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 min-w-[60px]">
          {getRankIcon(user.rank)}
          <span className="font-bold text-lg">#{user.rank}</span>
        </div>
        
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
            {user.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <span className="font-medium flex items-center space-x-2">
            <span>{user.name}</span>
            {user.isCurrentUser && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">You</span>
            )}
          </span>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Flame className="w-3 h-3 text-streak" />
              <span>{user.streak}d</span>
            </div>
            {showWeeklyPoints && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span>+{user.weeklyPoints} this week</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <PointsDisplay points={user.points} size="sm" />
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
                  {globalLeaderboard.map((user) => (
                    <LeaderboardRow key={user.id} user={user} showWeeklyPoints />
                  ))}
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
                  {friendsLeaderboard.map((user) => (
                    <LeaderboardRow key={user.id} user={user} />
                  ))}
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
              <div className="text-3xl font-bold text-primary">#847</div>
              <p className="text-sm text-muted-foreground">Global Ranking</p>
              <PointsDisplay points={2847} size="lg" className="justify-center" />
              <div className="flex justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-streak">7</div>
                  <div className="text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-success">+180</div>
                  <div className="text-muted-foreground">This Week</div>
                </div>
              </div>
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
                  <span>{weeklyChallenge.progress}/{weeklyChallenge.target}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <PointsDisplay points={weeklyChallenge.reward} size="sm" />
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