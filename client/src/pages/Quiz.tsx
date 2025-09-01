import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/gamification/ProgressBar';
import PointsDisplay from '@/components/gamification/PointsDisplay';
import { 
  CheckCircle, 
  XCircle, 
  Target, 
  Timer,
  Award,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Interactive quiz page with real-time feedback
 * Features: Multiple choice questions, immediate feedback, scoring, progress tracking
 */
const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Mock quiz data - replace with real API calls
  const quizData = {
    id: id || 'daily',
    title: id === 'daily' ? 'Daily Financial Quiz' : 'Financial Fundamentals Quiz',
    description: 'Test your knowledge and earn points!',
    questions: [
      {
        id: 1,
        question: "What percentage of your income should ideally go towards savings according to the 50/30/20 rule?",
        options: [
          "10%",
          "20%",
          "30%",
          "50%"
        ],
        correctAnswer: 1,
        explanation: "The 50/30/20 rule suggests allocating 20% of your income towards savings and debt repayment."
      },
      {
        id: 2,
        question: "Which of the following is considered a 'liquid' asset?",
        options: [
          "Real estate",
          "Savings account",
          "Retirement fund",
          "Collectibles"
        ],
        correctAnswer: 1,
        explanation: "A savings account is highly liquid because you can easily access your money without penalties or delays."
      },
      {
        id: 3,
        question: "What is the primary purpose of an emergency fund?",
        options: [
          "To invest in high-risk opportunities",
          "To cover unexpected expenses",
          "To buy luxury items",
          "To pay regular monthly bills"
        ],
        correctAnswer: 1,
        explanation: "An emergency fund is designed to cover unexpected expenses like medical bills, job loss, or major repairs."
      },
      {
        id: 4,
        question: "Which investment typically offers the highest potential returns over the long term?",
        options: [
          "Savings accounts",
          "Government bonds",
          "Stocks",
          "Certificates of deposit (CDs)"
        ],
        correctAnswer: 2,
        explanation: "Historically, stocks have provided the highest long-term returns, though they also come with higher risk."
      },
      {
        id: 5,
        question: "What does 'diversification' mean in investing?",
        options: [
          "Putting all money in one stock",
          "Spreading investments across different assets",
          "Only investing in bonds",
          "Keeping all money in cash"
        ],
        correctAnswer: 1,
        explanation: "Diversification means spreading your investments across different asset types to reduce overall risk."
      }
    ],
    pointsPerQuestion: 50,
    timeLimit: 300
  };

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    if (isCorrect) {
      toast.success(`Correct! +${quizData.pointsPerQuestion} points`, {
        icon: '🎉',
      });
    } else {
      toast.error('Incorrect answer', {
        icon: '❌',
      });
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: answers.length,
      percentage: Math.round((correct / answers.length) * 100),
      points: correct * quizData.pointsPerQuestion
    };
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
    setTimeLeft(quizData.timeLimit);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizCompleted) {
    const score = calculateScore();
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-glow border-success/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mb-4 animate-bounce-in">
              <Award className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-success">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{score.percentage}%</div>
              <p className="text-lg text-muted-foreground">
                You got {score.correct} out of {score.total} questions correct
              </p>
              <PointsDisplay points={score.points} showAnimation size="lg" />
            </div>

            {/* Performance Badge */}
            <div className="text-center">
              {score.percentage >= 80 && (
                <div className="inline-flex items-center space-x-2 bg-badge-gold/20 text-badge-gold px-4 py-2 rounded-full border border-badge-gold/30">
                  <Award className="w-4 h-4" />
                  <span className="font-bold">Excellent Performance!</span>
                </div>
              )}
              {score.percentage >= 60 && score.percentage < 80 && (
                <div className="inline-flex items-center space-x-2 bg-badge-silver/20 text-badge-silver px-4 py-2 rounded-full border border-badge-silver/30">
                  <Target className="w-4 h-4" />
                  <span className="font-bold">Good Job!</span>
                </div>
              )}
              {score.percentage < 60 && (
                <div className="inline-flex items-center space-x-2 bg-badge-bronze/20 text-badge-bronze px-4 py-2 rounded-full border border-badge-bronze/30">
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-bold">Keep Practicing!</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleRetakeQuiz}
                variant="outline" 
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              
              <Button 
                onClick={() => navigate('/learning')}
                className="w-full bg-gradient-primary"
              >
                Continue Learning
              </Button>
              
              <Button 
                onClick={() => navigate('/leaderboard')}
                variant="outline" 
                className="w-full"
              >
                View Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          {quizData.title}
        </h1>
        <p className="text-muted-foreground mt-2">{quizData.description}</p>
      </div>

      {/* Progress and Timer */}
      <Card className="mb-6 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <ProgressBar
            progress={progress}
            variant="primary"
            showPercentage
            animated
          />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ";
              
              if (showResult) {
                if (index === currentQ.correctAnswer) {
                  buttonClass += "border-success bg-success/10 text-success";
                } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
                  buttonClass += "border-destructive bg-destructive/10 text-destructive";
                } else {
                  buttonClass += "border-muted bg-muted/30 text-muted-foreground";
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "border-primary bg-primary/10 text-primary shadow-button";
                } else {
                  buttonClass += "border-border hover:border-primary/50 hover:bg-primary/5";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && (
                      <div>
                        {index === currentQ.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                        {index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer && (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <Card className="bg-muted/50 border-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent-foreground">?</span>
                  </div>
                  <p className="text-sm leading-relaxed">{currentQ.explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <div className="pt-4">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-primary hover:scale-105 transition-transform"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-success"
              >
                {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;