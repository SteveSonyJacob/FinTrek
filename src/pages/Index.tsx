import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/gamification/ProgressBar';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  Users,
  TrendingUp,
  Play,
  Flame
} from 'lucide-react';

/**
 * Landing/Home page for new users or logged-out state
 * Redirects to Dashboard for authenticated users
 */
const Index = () => {
  const navigate = useNavigate();

  // For demo purposes, we'll show the landing page
  // In a real app, you'd check auth state and redirect accordingly
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Master Your Financial Future
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Learn investing, trading, and money management through gamified lessons, 
            interactive quizzes, and a supportive community. Earn points, unlock badges, 
            and build real financial skills.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:scale-105 transition-transform shadow-button text-lg px-8"
            onClick={() => navigate('/learning')}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Free
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8"
            onClick={() => navigate('/community')}
          >
            <Users className="w-5 h-5 mr-2" />
            Join Community
          </Button>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="shadow-card bg-gradient-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">45+</div>
              <div className="text-muted-foreground">Interactive Lessons</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card border-accent/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We make financial education engaging, interactive, and rewarding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-badge">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Interactive Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Engaging video content and hands-on exercises that make learning finance fun and practical.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center mx-auto mb-4 shadow-badge">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Gamified Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Earn points, unlock achievements, and compete with friends as you master financial concepts.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-badge">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-lg">Community Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Connect with fellow learners, share insights, and get help from our supportive community.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4 shadow-badge">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Real Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Track your learning journey with detailed analytics and personalized recommendations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Dashboard Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">See Your Progress</h2>
          <p className="text-lg text-muted-foreground">
            Experience the dashboard that tracks your financial learning journey
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-glow border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>Your Learning Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sample Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <PointsDisplay points={2847} size="lg" className="justify-center mb-2" />
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Flame className="w-5 h-5 text-streak" />
                  <span className="text-2xl font-bold text-streak">7</span>
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">24/45</div>
                <div className="text-sm text-muted-foreground">Lessons Complete</div>
              </div>
            </div>

            <ProgressBar
              progress={53}
              label="Overall Course Progress"
              variant="primary"
              showPercentage
              animated
            />

            <div className="text-center">
              <Button 
                className="bg-gradient-primary hover:scale-105 transition-transform"
                onClick={() => navigate('/learning')}
              >
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
