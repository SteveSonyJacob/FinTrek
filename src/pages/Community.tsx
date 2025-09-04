import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Search,
  Plus,
  Heart,
  Reply,
  Pin,
  Award,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDiscussions, useCreateDiscussion, useCommunityStats } from '@/hooks/useCommunity';
import { toast } from 'sonner';

/**
 * Community page with forums, discussions, and social features
 * Features: Discussion forums, friend connections, post creation, comments
 */
const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamic data from Supabase
  const { discussions, loading: discussionsLoading, error: discussionsError } = useDiscussions();
  const { createDiscussion, loading: creatingDiscussion } = useCreateDiscussion();
  const { stats, loading: statsLoading } = useCommunityStats();

  // Mock data for friends (would be replaced with real data later)
  const mockDiscussions = [
    {
      id: 1,
      title: 'Best beginner investment strategies?',
      content: 'I just started my investment journey and looking for some solid beginner-friendly strategies. What would you recommend for someone with $1000 to start?',
      author: {
        name: 'Sarah Wilson',
        avatar: '',
        badge: 'Beginner Trader',
        level: 'Bronze'
      },
      category: 'Investing',
      replies: 12,
      likes: 24,
      isPinned: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastActivity: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 2,
      title: 'Emergency fund vs. paying off debt - what comes first?',
      content: 'I have about $5000 in credit card debt and no emergency fund. Should I focus on building an emergency fund first or pay off the debt?',
      author: {
        name: 'Mike Chen',
        avatar: '',
        badge: 'Finance Explorer',
        level: 'Silver'
      },
      category: 'Personal Finance',
      replies: 8,
      likes: 15,
      isPinned: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Cryptocurrency for beginners - worth it?',
      content: 'Everyone is talking about crypto. Is it worth getting into as a beginner, or should I stick to traditional investments?',
      author: {
        name: 'Emma Rodriguez',
        avatar: '',
        badge: 'Learning Enthusiast',
        level: 'Bronze'
      },
      category: 'Cryptocurrency',
      replies: 18,
      likes: 32,
      isPinned: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];

  const friends = [
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: '',
      status: 'online',
      points: 4520,
      lastSeen: 'Active now'
    },
    {
      id: 2,
      name: 'Lisa Park',
      avatar: '',
      status: 'offline',
      points: 3240,
      lastSeen: '2 hours ago'
    },
    {
      id: 3,
      name: 'David Kumar',
      avatar: '',
      status: 'online',
      points: 5680,
      lastSeen: 'Active now'
    }
  ];

  const categories = [
    { name: 'Personal Finance', count: 45, color: 'text-primary' },
    { name: 'Investing', count: 32, color: 'text-success' },
    { name: 'Trading', count: 28, color: 'text-secondary' },
    { name: 'Cryptocurrency', count: 19, color: 'text-accent' },
    { name: 'General', count: 67, color: 'text-muted-foreground' }
  ];

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    try {
      await createDiscussion(newPostTitle, newPostContent, 'General');
      toast.success('Discussion created successfully!');
      setNewPostTitle('');
      setNewPostContent('');
      setActiveTab('discussions');
    } catch (error) {
      toast.error('Failed to create discussion. Please try again.');
      console.error('Error creating discussion:', error);
    }
  };

  const DiscussionCard = ({ discussion }: { discussion: any }) => {
    const profile = discussion.profiles?.[0];
    const authorName = profile?.name || 'Anonymous User';
    
    return (
    <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                {authorName.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{authorName}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-badge-bronze/20 text-badge-bronze">
                  Learner
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          {discussion.is_pinned && (
            <Pin className="w-4 h-4 text-secondary" />
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
            {discussion.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {discussion.content}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className={`px-2 py-1 rounded-full text-xs ${categories.find(c => c.name === discussion.category)?.color} bg-current/10`}>
                {discussion.category}
              </span>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{discussion.reply_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{discussion.like_count}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              Last activity {formatDistanceToNow(new Date(discussion.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Community
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow learners, share knowledge, and grow together in your financial journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Members</span>
                <span className="font-bold">{stats.activeMembers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discussions</span>
                <span className="font-bold">{stats.totalDiscussions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-bold text-success">+{stats.weeklyDiscussions}</span>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <span className={`font-medium ${category.color}`}>{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.count}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Friends Online */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Friends Online</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {friends.filter(f => f.status === 'online').map((friend) => (
                <div key={friend.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.lastSeen}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="discussions" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Discussions</span>
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="discussions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Discussions</h2>
                <Button size="sm" className="bg-gradient-primary">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>

              <div className="space-y-4">
                {discussionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading discussions...</p>
                  </div>
                ) : discussionsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Error loading discussions: {discussionsError}</p>
                  </div>
                ) : discussions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No discussions yet. Be the first to start one!</p>
                  </div>
                ) : (
                  discussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))
                )}
              </div>

              <div className="text-center pt-4">
                <Button variant="outline">Load More Discussions</Button>
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Create New Discussion</CardTitle>
                  <CardDescription>
                    Share your thoughts, ask questions, or start a conversation with the community.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Enter discussion title..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Share your thoughts, questions, or insights..."
                      rows={6}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Be respectful and helpful to build a positive community.
                    </div>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPostTitle.trim() || !newPostContent.trim() || creatingDiscussion}
                      className="bg-gradient-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Community;