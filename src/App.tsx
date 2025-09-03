import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useSession } from "@supabase/auth-helpers-react";

// Pages
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";


import Auth from "./pages/Auth";

// Layout
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => {
  const session = useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* If no session, force user to Auth */}
              {!session ? (
                <>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<Navigate to="/auth" replace />} />
                </>
              ) : (
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="learning" element={<Learning />} />
                  <Route path="lesson/:id" element={<Lesson />} />
                  <Route path="quiz/:id" element={<Quiz />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="community" element={<Community />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              )}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;