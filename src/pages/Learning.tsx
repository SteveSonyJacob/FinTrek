import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/gamification/ProgressBar';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Lock,
  TrendingUp,
  DollarSign,
  PieChart,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Learning modules page displaying available courses and lessons
 * Features: Course categories, progress tracking, locked/unlocked content
 */
const Learning = () => {
  // Mock data - replace with real API calls
  const learningModules = [
    {
      id: 1,
      title: 'Financial Fundamentals',
      description: 'Master the basics of personal finance and money management',
      icon: DollarSign,
      color: 'bg-gradient-primary',
      lessons: 8,
      completedLessons: 6,
      difficulty: 'Beginner',
      estimatedTime: '2 hours',
      unlocked: true,
      topics: ['Budgeting', 'Saving', 'Emergency Funds', 'Financial Goals']
    },
    {
      id: 2,
      title: 'Investment Basics',
      description: 'Learn the fundamentals of investing and building wealth',
      icon: TrendingUp,
      color: 'bg-gradient-success',
      lessons: 12,
      completedLessons: 4,
      difficulty: 'Beginner',
      estimatedTime: '3 hours',
      unlocked: true,
      topics: ['Stocks', 'Bonds', 'ETFs', 'Risk Management']
    },
    {
      id: 3,
      title: 'Trading Strategies',
      description: 'Advanced trading techniques and market analysis',
      icon: PieChart,
      color: 'bg-gradient-secondary',
      lessons: 15,
      completedLessons: 0,
      difficulty: 'Intermediate',
      estimatedTime: '5 hours',
      unlocked: true,
      topics: ['Technical Analysis', 'Chart Patterns', 'Day Trading', 'Options']
    },
    {
      id: 4,
      title: 'Portfolio Management',
      description: 'Build and manage diversified investment portfolios',
      icon: Briefcase,
      color: 'bg-accent',
      lessons: 10,
      completedLessons: 0,
      difficulty: 'Advanced',
      estimatedTime: '4 hours',
      unlocked: false,
      topics: ['Asset Allocation', 'Rebalancing', 'Risk Assessment', 'Performance Analysis']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Learning Modules
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master financial literacy through interactive lessons, quizzes, and real-world applications.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">53%</div>
              <div className="text-sm text-muted-foreground">Overall Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">24</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-sm text-muted-foreground">Hours Studied</div>
            </div>
          </div>
          <ProgressBar
            progress={53}
            label="Complete all modules to unlock advanced features"
            variant="primary"
            showPercentage
            animated
          />
        </CardContent>
      </Card>

      {/* Learning Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningModules.map((module) => {
          const Icon = module.icon;
          const progress = (module.completedLessons / module.lessons) * 100;
          const isCompleted = module.completedLessons === module.lessons;

          return (
            <Card 
              key={module.id} 
              className={`shadow-card hover:shadow-glow transition-all duration-300 ${
                !module.unlocked ? 'opacity-60' : 'hover:scale-[1.02]'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center shadow-badge`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    {isCompleted && (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{module.title}</span>
                  {!module.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                {module.unlocked && (
                  <ProgressBar
                    progress={progress}
                    label={`${module.completedLessons}/${module.lessons} lessons completed`}
                    variant="primary"
                    showPercentage
                  />
                )}

                {/* Module Info */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{module.lessons} lessons</span>
                  <span>{module.estimatedTime}</span>
                </div>

                {/* Topics */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Key Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {module.unlocked ? (
                    <Link to={`/lesson/${module.id}`}>
                      <Button className="w-full bg-gradient-primary hover:scale-105 transition-transform">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {module.completedLessons > 0 ? 'Continue Learning' : 'Start Module'}
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full">
                      <Lock className="w-4 h-4 mr-2" />
                      Locked - Complete previous modules
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Learning;