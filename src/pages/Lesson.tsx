import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
  const location = useLocation() as { state?: { moduleTitle?: string } };
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  
  // Mock module library - replace with real API calls
  const moduleId = parseInt(id || '1');
  const moduleLibrary: Record<number, { title: string; lessons: Array<{ id: number; title: string; duration: string; type: 'video' | 'interactive' | 'reading'; content: string; videoUrl?: string; completed?: boolean; }>; }> = {
    1: {
      title: 'Financial Fundamentals',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Personal Finance',
          duration: '15 min',
          type: 'video',
          content: `\nWhy financial literacy matters\n- Informs better money decisions, reduces stress, and improves long-term outcomes.\n\nDifference between needs vs. wants\n- Needs: Essentials (rent, utilities, groceries).\n- Wants: Discretionary (eating out, entertainment).\n\nThe foundation of money management\n- Earn, spend, save, invest, protect. Build habits that prioritize savings and plan spending.\n`,
          videoUrl: 'https://www.youtube.com/watch?v=UcAY6qRHlw0',
          completed: false
        },
        {
          id: 2,
          title: 'Budgeting Basics',
          duration: '16 min',
          type: 'reading',
          content: `\nWhat is a budget and why it’s important\n- A plan for income and expenses; ensures you live within means and reach goals.\n\nCommon budgeting methods\n- 50/30/20 rule: Needs/Wants/Saving & debt.\n- Zero-based budgeting: Every dollar assigned a job.\n- Envelope system: Allocate cash (or digital envelopes) per category.\n\nTracking income and expenses\n- Use bank exports, spreadsheets, or apps to monitor categories.\n`,
          completed: false
        },
        {
          id: 3,
          title: 'Creating and Maintaining a Budget',
          duration: '18 min',
          type: 'interactive',
          content: `\nStep-by-step budgeting process\n1) List net income.\n2) List fixed & variable expenses.\n3) Set targets per category.\n4) Allocate savings/debt payments.\n5) Review weekly.\n\nAdjusting budgets for lifestyle changes\n- Update for new job, move, family changes, or inflation.\n\nUsing tools/apps for budgeting\n- Spreadsheets, dedicated apps, and bank tools streamline tracking.\n`,
          completed: false
        },
        {
          id: 4,
          title: 'Saving Principles',
          duration: '12 min',
          type: 'reading',
          content: `\nImportance of paying yourself first\n- Automate transfers to savings before spending.\n\nShort-term vs. long-term savings\n- Short-term: Upcoming purchases (0–2 yrs).\n- Long-term: Large goals (house, retirement).\n\nAutomating savings\n- Scheduled transfers and employer programs build consistency.\n`,
          completed: false
        },
        {
          id: 5,
          title: 'Building an Emergency Fund',
          duration: '14 min',
          type: 'reading',
          content: `\nWhat an emergency fund is (and isn’t)\n- Cash reserve for unexpected essentials; not for planned purchases.\n\nHow much to save (3–6 months rule)\n- Tailor to job stability, dependents, and fixed costs.\n\nWhere to keep emergency funds\n- High-yield savings, money market—accessible and low risk.\n`,
          completed: false
        },
        {
          id: 6,
          title: 'Setting Financial Goals',
          duration: '13 min',
          type: 'reading',
          content: `\nTypes of financial goals\n- Short-term (0–2 yrs), medium-term (2–5 yrs), long-term (5+ yrs).\n\nSMART goals framework\n- Specific, Measurable, Achievable, Relevant, Time-bound.\n\nAligning goals with personal values\n- Let priorities guide spending and saving choices.\n`,
          completed: false
        },
        {
          id: 7,
          title: 'Strategies for Achieving Financial Goals',
          duration: '15 min',
          type: 'reading',
          content: `\nPrioritizing multiple goals\n- Sequence goals and assign percentages to each.\n\nBalancing debt repayment and savings\n- Tackle high-interest debt while maintaining basic savings.\n\nUsing goal-based savings accounts\n- Separate buckets improve clarity and commitment.\n`,
          completed: false
        },
        {
          id: 8,
          title: 'Putting It All Together',
          duration: '16 min',
          type: 'reading',
          content: `\nCreating a personal financial roadmap\n- Combine budget, savings plan, and goal timelines.\n\nCommon mistakes to avoid\n- Overspending, skipping emergency funds, ignoring progress reviews.\n\nBuilding habits for long-term success\n- Review monthly, automate, and iterate as life changes.\n`,
          completed: false
        }
      ]
    },
    2: {
      title: 'Investment Basics',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Investing',
          duration: '12 min',
          type: 'video',
          content: `\nWhat is investing?\nInvesting is allocating money into assets with the expectation of generating returns over time.\n\nDifference between saving and investing\n- Saving: Short-term, low risk, high liquidity (e.g., bank accounts).\n- Investing: Long-term, higher risk/return potential (e.g., stocks, bonds).\n\nImportance of time horizon and compounding\n- Time horizon affects suitable assets and risk.\n- Compounding allows gains to generate further gains; starting early matters.\n`,
          videoUrl: 'https://www.youtube.com/watch?v=qIw-yFC-HNU',
          completed: false
        },
        {
          id: 2,
          title: 'Financial Markets Overview',
          duration: '14 min',
          type: 'reading',
          content: `\nPrimary vs. secondary markets\n- Primary: New securities issued (IPOs, new bond issues).\n- Secondary: Existing securities traded among investors (exchanges).\n\nRole of exchanges and brokers\n- Exchanges match buyers and sellers; brokers route orders and provide access.\n\nHow prices are determined\n- Supply and demand set prices; market orders and limit orders influence execution.\n`,
          completed: false
        },
        {
          id: 3,
          title: 'Stocks (Equities) – Basics',
          duration: '15 min',
          type: 'reading',
          content: `\nWhat is a stock?\n- Ownership share in a company with claim on earnings and assets.\n\nCommon vs. preferred stock\n- Common: Voting rights, variable dividends.\n- Preferred: Priority dividends, limited/no voting.\n\nDividends and capital gains\n- Dividends: Cash/share payouts.\n- Capital gains: Profit from selling above purchase price.\n`,
          completed: false
        },
        {
          id: 4,
          title: 'Stocks – Analysis and Valuation',
          duration: '18 min',
          type: 'reading',
          content: `\nFundamental analysis\n- EPS, P/E ratio, book value, margins, growth.\n\nTechnical analysis basics\n- Charts, trends, support/resistance, volume.\n\nGrowth vs. value investing\n- Growth: High expected growth, higher multiples.\n- Value: Undervalued by fundamentals, lower multiples.\n`,
          completed: false
        },
        {
          id: 5,
          title: 'Bonds – Basics',
          duration: '12 min',
          type: 'reading',
          content: `\nWhat are bonds?\n- Loans to governments/corporations with periodic interest (coupons) and principal repayment.\n\nTypes of bonds\n- Government, corporate, municipal; varying risk and tax treatment.\n\nCoupon rate, maturity, and face value\n- Coupon: Interest rate paid.\n- Maturity: When principal is repaid.\n- Face value: Principal amount.\n`,
          completed: false
        },
        {
          id: 6,
          title: 'Bonds – Risks and Valuation',
          duration: '16 min',
          type: 'reading',
          content: `\nInterest rate risk\n- Bond prices move inversely to rates; duration sensitivity.\n\nCredit/default risk\n- Issuer may fail to pay; credit ratings guide risk.\n\nYield to maturity (YTM) and pricing\n- YTM: Total return if held to maturity; price adjusts to align with market yields.\n`,
          completed: false
        },
        {
          id: 7,
          title: 'Exchange-Traded Funds (ETFs)',
          duration: '13 min',
          type: 'reading',
          content: `\nWhat are ETFs?\n- Pooled investment funds that trade on exchanges like stocks.\n\nETFs vs. mutual funds\n- Intraday trading, typically lower fees, transparency.\n\nPopular ETF categories\n- Index, sectoral, thematic, international.\n`,
          completed: false
        },
        {
          id: 8,
          title: 'Portfolio Diversification',
          duration: '14 min',
          type: 'reading',
          content: `\nWhy diversification matters\n- Reduces unsystematic risk by spreading exposure.\n\nCorrelation between assets\n- Lower correlation improves diversification benefits.\n\nBalanced portfolio\n- Blend stocks, bonds, and ETFs to match risk tolerance and goals.\n`,
          completed: false
        },
        {
          id: 9,
          title: 'Risk and Return',
          duration: '15 min',
          type: 'reading',
          content: `\nRisk vs. reward trade-off\n- Higher expected returns generally require higher risk.\n\nSystematic vs. unsystematic risk\n- Market-wide vs. asset-specific; diversification addresses the latter.\n\nBeta, volatility, standard deviation\n- Metrics to quantify risk; compare assets and portfolios.\n`,
          completed: false
        },
        {
          id: 10,
          title: 'Risk Management Strategies',
          duration: '17 min',
          type: 'reading',
          content: `\nAsset allocation\n- Primary driver of long-term outcomes; align with goals and horizon.\n\nHedging basics (high level)\n- Options, futures, inverse ETFs can reduce downside risk.\n\nStop-loss orders and position sizing\n- Predefined exit points; limit exposure per trade/investment.\n`,
          completed: false
        },
        {
          id: 11,
          title: 'Behavioral Finance',
          duration: '12 min',
          type: 'reading',
          content: `\nCommon investor biases\n- Overconfidence, loss aversion, herd behavior.\n\nEmotional investing pitfalls\n- Chasing performance, panic selling, anchoring.\n\nLong-term mindset\n- Discipline, patience, and adherence to plan.\n`,
          completed: false
        },
        {
          id: 12,
          title: 'Putting It All Together',
          duration: '18 min',
          type: 'reading',
          content: `\nSteps to start investing\n- Define goals, build emergency fund, choose a brokerage, start small.\n\nCreating an investment plan\n- Asset allocation, contribution schedule, rebalancing policy.\n\nMonitoring and rebalancing\n- Periodically review; rebalance to targets.\n\nKey do’s and don’ts\n- Do diversify, keep costs low, think long term. Don’t time the market, overtrade, or ignore taxes.\n`,
          completed: false
        }
      ]
    },
    3: {
      title: 'Trading Strategies',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Technical Analysis',
          duration: '14 min',
          type: 'video',
          content: `\nTechnical vs. fundamental analysis\n- Technical: Price/volume-based analysis.\n- Fundamental: Business/valuation-based analysis.\n\nCore principles\n- Market discounts everything.\n- Price moves in trends.\n`,
          videoUrl: 'https://www.youtube.com/watch?v=eynxyoKgpng',
          completed: false
        },
        {
          id: 2,
          title: 'Price Charts and Data',
          duration: '12 min',
          type: 'reading',
          content: `\nLine, bar, and candlestick charts\n- Different ways to visualize price data.\n\nReading OHLC\n- Open, High, Low, Close: what each means and why it matters.\n`,
          completed: false
        },
        {
          id: 3,
          title: 'Moving Averages and Trend Indicators',
          duration: '16 min',
          type: 'reading',
          content: `\nSMA vs. EMA\n- Simple vs. Exponential: smoothing vs. responsiveness.\n\nMACD\n- Signal line crossovers, histogram, and trend direction.\n`,
          completed: false
        },
        {
          id: 4,
          title: 'Momentum and Volume Indicators',
          duration: '15 min',
          type: 'reading',
          content: `\nRSI, Stochastic Oscillator\n- Overbought/oversold and divergence.\n\nOn-Balance Volume (OBV)\n- Confirming price moves with volume.\n`,
          completed: false
        },
        {
          id: 5,
          title: 'Support, Resistance, and Trendlines',
          duration: '14 min',
          type: 'reading',
          content: `\nDrawing trendlines properly\n- Touches, validation, and adjustments.\n\nTrading breakouts and avoiding traps\n- Confirmation, retests, and false breakouts.\n`,
          completed: false
        },
        {
          id: 6,
          title: 'Continuation Chart Patterns',
          duration: '15 min',
          type: 'reading',
          content: `\nFlags, pennants, triangles\n- Characteristics and context.\n\nEntry and exit rules\n- Measured moves, invalidation levels.\n`,
          completed: false
        },
        {
          id: 7,
          title: 'Reversal Chart Patterns',
          duration: '16 min',
          type: 'reading',
          content: `\nHead and shoulders, double top/bottom\n- Anatomy and targets.\n\nSpotting reversals early\n- Volume, momentum shifts, and failure patterns.\n`,
          completed: false
        },
        {
          id: 8,
          title: 'Candlestick Patterns',
          duration: '14 min',
          type: 'reading',
          content: `\nDoji, hammer, engulfing\n- What they suggest about sentiment.\n\nStrength and limitations\n- Need for context and confirmation.\n`,
          completed: false
        },
        {
          id: 9,
          title: 'Combining Indicators and Patterns',
          duration: '15 min',
          type: 'reading',
          content: `\nUsing multiple confirmations\n- Avoiding indicator overload.\n\nStrategy building\n- Rules, testing, and consistency.\n`,
          completed: false
        },
        {
          id: 10,
          title: 'Introduction to Day Trading',
          duration: '15 min',
          type: 'reading',
          content: `\nCharacteristics, tools, and setups\n- Platform, data, hotkeys, and layouts.\n\nTimeframes and markets\n- Intraday charts and market selection.\n`,
          completed: false
        },
        {
          id: 11,
          title: 'Day Trading Strategies',
          duration: '16 min',
          type: 'reading',
          content: `\nMomentum trading\n- Following strength with risk controls.\n\nScalping\n- Small, frequent trades with tight risk.\n\nNews/event-based trading\n- Volatility handling and risk.\n`,
          completed: false
        },
        {
          id: 12,
          title: 'Risk Management for Traders',
          duration: '15 min',
          type: 'reading',
          content: `\nPosition sizing, stop-loss, take-profit\n- Risk per trade and reward-to-risk.\n\nControlling emotions\n- Avoiding overtrading; sticking to plan.\n`,
          completed: false
        },
        {
          id: 13,
          title: 'Options Trading Basics',
          duration: '17 min',
          type: 'reading',
          content: `\nCalls, puts, strike price, expiration\n- Core terminology.\n\nOptions pricing\n- Intrinsic vs. extrinsic value.\n`,
          completed: false
        },
        {
          id: 14,
          title: 'Beginner-Friendly Options Strategies',
          duration: '18 min',
          type: 'reading',
          content: `\nCovered calls\n- Income with owned shares.\n\nProtective puts\n- Downside protection.\n\nCash-secured puts\n- Entering positions at target prices.\n`,
          completed: false
        },
        {
          id: 15,
          title: 'Advanced Options Strategies',
          duration: '19 min',
          type: 'reading',
          content: `\nSpreads (bull call, bear put)\n- Defined-risk directional plays.\n\nStraddles and strangles\n- Volatility strategies.\n\nOptions as hedging tools\n- Portfolio risk mitigation.\n`,
          completed: false
        }
      ]
    },
    4: {
      title: 'Portfolio Management',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Portfolio Management',
          duration: '13 min',
          type: 'video',
          content: `\nWhat is a portfolio?\n- A collection of assets held by an investor.\n\nWhy diversification matters\n- Reduces unsystematic risk by spreading exposure.\n\nRole of portfolio management in wealth building\n- Disciplined allocation, risk control, and rebalancing drive outcomes.\n`,
          videoUrl: 'https://www.youtube.com/watch?v=j8obKof2MDM',
          completed: false
        },
        {
          id: 2,
          title: 'Principles of Asset Allocation',
          duration: '15 min',
          type: 'reading',
          content: `\nDefinition and importance\n- Allocating among equities, bonds, cash, and alternatives manages risk/return.\n\nAsset classes\n- Equities, bonds, cash, alternatives each behave differently.\n\nMatching allocation to horizon\n- Longer horizons can typically assume more equity exposure.\n`,
          completed: false
        },
        {
          id: 3,
          title: 'Strategic vs. Tactical Asset Allocation',
          duration: '14 min',
          type: 'reading',
          content: `\nStrategic vs. tactical\n- Strategic: long-term target mix.\n- Tactical: short-term tilts around targets.\n\nWhen to shift allocations\n- Valuation extremes, risk outlook, or life changes.\n\nReal-world examples\n- Incremental tilts rather than wholesale changes.\n`,
          completed: false
        },
        {
          id: 4,
          title: 'Diversification Techniques',
          duration: '15 min',
          type: 'reading',
          content: `\nGeographic, sectoral, and asset-class diversification\n- Spread across regions, industries, and instruments.\n\nCorrelation between assets\n- Lower correlation improves risk-adjusted returns.\n\nAvoiding over-diversification\n- Diminishing benefits beyond a point.\n`,
          completed: false
        },
        {
          id: 5,
          title: 'Risk Assessment Methods',
          duration: '16 min',
          type: 'reading',
          content: `\nTypes of risk\n- Market, credit, liquidity, inflation risks.\n\nQuantitative measures\n- Beta, standard deviation, Sharpe ratio.\n\nInvestor risk profiling\n- Questionnaires and experience inform tolerance.\n`,
          completed: false
        },
        {
          id: 6,
          title: 'Building a Risk-Adjusted Portfolio',
          duration: '15 min',
          type: 'reading',
          content: `\nBalancing tolerance with returns\n- Align allocation with goals and comfort.\n\nDefensive vs. aggressive portfolios\n- Different mixes for drawdown sensitivity.\n\nSample model portfolios\n- Conservative, balanced, growth examples.\n`,
          completed: false
        },
        {
          id: 7,
          title: 'Portfolio Rebalancing',
          duration: '14 min',
          type: 'reading',
          content: `\nWhat is rebalancing and why it’s needed\n- Restore targets as markets shift.\n\nCalendar vs. threshold-based\n- Time-based or deviation-based triggers.\n\nTax and cost implications\n- Consider taxes, fees, and slippage.\n`,
          completed: false
        },
        {
          id: 8,
          title: 'Performance Analysis Basics',
          duration: '16 min',
          type: 'reading',
          content: `\nMeasuring returns\n- Absolute, relative, risk-adjusted.\n\nBenchmarks and index comparison\n- Evaluate against suitable indices.\n\nAlpha, Sharpe ratio, key metrics\n- Separate skill from market exposure.\n`,
          completed: false
        },
        {
          id: 9,
          title: 'Monitoring and Adjusting Portfolios',
          duration: '14 min',
          type: 'reading',
          content: `\nSetting review frequency\n- Quarterly or semi-annual check-ins.\n\nResponding to life events and markets\n- Adjust for income changes, goals, or risk.\n\nAvoiding emotional decisions\n- Rely on plan and thresholds, not headlines.\n`,
          completed: false
        },
        {
          id: 10,
          title: 'Putting It All Together',
          duration: '17 min',
          type: 'reading',
          content: `\nDesigning a personal portfolio\n- Define goals, set allocation, pick vehicles, plan rebalancing.\n\nBest practices for growth\n- Diversify, minimize fees, stay invested.\n\nCommon mistakes to avoid\n- Chasing performance, excessive trading, ignoring costs.\n`,
          completed: false
        }
      ]
    }
  };

  // Prefer title from navigation state when available, otherwise use id mapping
  const titleFromState = location.state?.moduleTitle;
  const selectedModuleById = moduleLibrary[moduleId];
  const selectedModuleByTitle = titleFromState
    ? Object.values(moduleLibrary).find(m => m.title === titleFromState)
    : undefined;
  const selectedModule = selectedModuleByTitle || selectedModuleById || moduleLibrary[1];
  const moduleData = {
    id: moduleId,
    title: selectedModule.title,
    totalLessons: selectedModule.lessons.length,
    currentLessonIndex: currentLesson,
    lessons: selectedModule.lessons
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
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {isPlaying && (
                    (moduleData.title === 'Financial Fundamentals' && currentLesson === 0) ||
                    (moduleData.title === 'Investment Basics' && currentLesson === 0) ||
                    (moduleData.title === 'Trading Strategies' && currentLesson === 0) ||
                    (moduleData.title === 'Portfolio Management' && currentLesson === 0)
                  ) ? (
                    <iframe
                      className="w-full h-full"
                      src={
                        moduleData.title === 'Financial Fundamentals'
                          ? 'https://www.youtube.com/embed/UcAY6qRHlw0?autoplay=1'
                          : moduleData.title === 'Investment Basics'
                            ? 'https://www.youtube.com/embed/qIw-yFC-HNU?autoplay=1'
                            : moduleData.title === 'Trading Strategies'
                              ? 'https://www.youtube.com/embed/eynxyoKgpng?autoplay=1'
                              : 'https://www.youtube.com/embed/j8obKof2MDM?autoplay=1'
                      }
                      title={
                        moduleData.title === 'Financial Fundamentals'
                          ? 'Financial Fundamentals Lesson Video'
                          : moduleData.title === 'Investment Basics'
                            ? 'Investment Basics Lesson Video'
                            : moduleData.title === 'Trading Strategies'
                              ? 'Trading Strategies Lesson Video'
                              : 'Portfolio Management Lesson Video'
                      }
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {(
                        (moduleData.title === 'Financial Fundamentals' && currentLesson === 0) ||
                        (moduleData.title === 'Investment Basics' && currentLesson === 0) ||
                        (moduleData.title === 'Trading Strategies' && currentLesson === 0) ||
                        (moduleData.title === 'Portfolio Management' && currentLesson === 0)
                      ) ? (
                        <button
                          type="button"
                          onClick={() => setIsPlaying(true)}
                          className="relative w-full h-full"
                          aria-label={
                            moduleData.title === 'Financial Fundamentals'
                              ? 'Play Financial Fundamentals video'
                              : moduleData.title === 'Investment Basics'
                                ? 'Play Investment Basics video'
                                : moduleData.title === 'Trading Strategies'
                                  ? 'Play Trading Strategies video'
                                  : 'Play Portfolio Management video'
                          }
                        >
                          {moduleData.title === 'Financial Fundamentals' ? (
                            <img
                              src="https://img.youtube.com/vi/UcAY6qRHlw0/hqdefault.jpg"
                              alt="Financial Fundamentals video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : moduleData.title === 'Investment Basics' ? (
                            <img
                              src="https://img.youtube.com/vi/qIw-yFC-HNU/hqdefault.jpg"
                              alt="Investment Basics video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : moduleData.title === 'Trading Strategies' ? (
                            <img
                              src="https://img.youtube.com/vi/eynxyoKgpng/hqdefault.jpg"
                              alt="Trading Strategies video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="https://img.youtube.com/vi/j8obKof2MDM/hqdefault.jpg"
                              alt="Portfolio Management video thumbnail"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center space-x-3 bg-background/80 backdrop-blur px-4 py-2 rounded-full shadow-card">
                              <PlayCircle className="w-5 h-5 text-primary" />
                              <span className="text-sm font-medium">Play Video</span>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="text-center space-y-4 p-6">
                    <PlayCircle className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-muted-foreground">Video coming soon</p>
                          <Button className="bg-gradient-primary" onClick={() => setIsPlaying(true)}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                      )}
                    </>
                  )}
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