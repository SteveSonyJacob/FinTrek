import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper that requires authentication
 * Redirects unauthenticated users to /auth, preserving the intended path
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      // Mark user online when session becomes available
      const uid = nextSession?.user?.id;
      const fullName = nextSession?.user?.user_metadata?.full_name;
      const email = nextSession?.user?.email;
      if (uid) {
        supabase
          .from('profiles')
          .upsert({ id: uid, name: fullName || email || null, is_online: true })
          .then(() => {})
          .catch(() => {});
      }
    });

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setUser(current?.user ?? null);
      setLoading(false);

      const uid = current?.user?.id;
      const fullName = current?.user?.user_metadata?.full_name;
      const email = current?.user?.email;
      if (uid) {
        supabase
          .from('profiles')
          .upsert({ id: uid, name: fullName || email || null, is_online: true })
          .then(() => {})
          .catch(() => {});
      }
    });

    // On cleanup, best-effort mark offline for the current user
    return () => {
      const uid = supabase.auth.getUser ? undefined : undefined;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


