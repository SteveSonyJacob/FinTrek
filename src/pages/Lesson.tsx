import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/gamification/ProgressBar';
import { 
  ArrowLeft, 
  ArrowRight, 
  PlayCircle, 
  BookOpen, 
  CheckCircle,
  Target,
  Lightbulb
} from 'lucide-react';

/**
 * Individual lesson page with content, video, and navigation
 * Features: Lesson content, progress tracking, navigation, completion tracking
 */
const Lesson = () => {
  const { id } = useParams();
  const [currentLesson, setCurrentLesson] = useState(0);
  
  // Mock data - replace with real API calls
  const moduleData = {
    id: parseInt(id || '1'),
    title: 'Financial Fundamentals',
    totalLessons: 8,
    currentLessonIndex: 0,
    lessons: [
      {
        id: 1,
        title: 'Introduction to Personal Finance',
        duration: '15 min',
        type: 'video',
        content: `
          Personal finance is the foundation of financial freedom and security. In this lesson, we'll explore the key principles that will guide your financial journey.

          ## Why Personal Finance Matters

          Understanding personal finance helps you:
          - Make informed decisions about money
          - Build wealth over time
          - Achieve your financial goals
          - Avoid common financial pitfalls

          ## The Four Pillars of Personal Finance

          1. **Budgeting**: Creating a plan for your money
          2. **Saving**: Setting aside money for future needs
          3. **Investing**: Growing your wealth through various instruments
          4. **Protection**: Insurance and emergency planning

          ## Key Takeaway

          Financial literacy is not just about making money—it's about making smart decisions with the money you have.
        `,
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 2,
        title: 'Creating Your First Budget',
        duration: '20 min',
        type: 'interactive',
        content: `
          A budget is your financial roadmap. It tells your money where to go instead of wondering where it went.

          ## The 50/30/20 Rule

          A simple budgeting framework:
          - **50%** for needs (housing, utilities, groceries)
          - **30%** for wants (entertainment, dining out)
          - **20%** for savings and debt repayment

          ## Steps to Create Your Budget

          1. **Calculate your monthly income** (after taxes)
          2. **List all your expenses** (fixed and variable)
          3. **Categorize expenses** (needs vs wants)
          4. **Allocate money** to each category
          5. **Track and adjust** regularly

          ## Pro Tips

          - Use budgeting apps to track expenses automatically
          - Review your budget monthly
          - Be realistic with your allocations
          - Leave room for unexpected expenses
        `,
        completed: false
      }
    ]
  };

  const lesson = moduleData.lessons[currentLesson];
  const progress = ((currentLesson + 1) / moduleData.totalLessons) * 100;

  const handleNext = () => {
    if (currentLesson < moduleData.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleCompleteLesson = () => {
    // Mark lesson as completed and navigate to quiz
    console.log('Lesson completed!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/learning">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
        </Link>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">{moduleData.title}</h1>
          <p className="text-sm text-muted-foreground">
            Lesson {currentLesson + 1} of {moduleData.totalLessons}
          </p>
        </div>

        <div className="w-24" /> {/* Spacer for alignment */}
      </div>

      {/* Progress Bar */}
      <Card className="mb-6 shadow-card">
        <CardContent className="p-4">
          <ProgressBar
            progress={progress}
            label="Module Progress"
            variant="primary"
            showPercentage
            animated
          />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {lesson.type === 'video' ? (
                    <PlayCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-accent" />
                  )}
                  <span>{lesson.title}</span>
                </CardTitle>
                {lesson.completed && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
              <CardDescription>
                Duration: {lesson.duration} • {lesson.type === 'video' ? 'Video Lesson' : 'Interactive Content'}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Video Player (if video lesson) */}
          {lesson.type === 'video' && (
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                    <p className="text-muted-foreground">Video Player Placeholder</p>
                    <Button className="bg-gradient-primary">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          <Card className="shadow-card">
            <CardContent className="p-6 prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {lesson.content}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentLesson === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button onClick={handleCompleteLesson} className="bg-gradient-success">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
              
              {currentLesson < moduleData.lessons.length - 1 ? (
                <Button onClick={handleNext} className="bg-gradient-primary">
                  Next Lesson
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link to={`/quiz/${moduleData.id}`}>
                  <Button className="bg-gradient-secondary">
                    Take Quiz
                    <Target className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Navigation */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {moduleData.lessons.map((lessonItem, index) => (
                <button
                  key={lessonItem.id}
                  onClick={() => setCurrentLesson(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    index === currentLesson
                      ? 'bg-primary text-primary-foreground border-primary shadow-button'
                      : 'bg-card border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{lessonItem.title}</span>
                    {lessonItem.completed && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <p className="text-xs opacity-75 mt-1">{lessonItem.duration}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Learning Tips */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Lightbulb className="w-5 h-5 text-secondary" />
                <span>Study Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>💡 Take notes while watching videos</p>
                <p>🎯 Complete practice exercises</p>
                <p>🔄 Review previous lessons</p>
                <p>❓ Ask questions in the community</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lesson;