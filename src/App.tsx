import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/useAuthStore';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/auth/AuthGuard';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { UserOnboardingPage } from './pages/onboarding/UserOnboardingPage';
import { BusinessOnboardingPage } from './pages/onboarding/BusinessOnboardingPage';
import { SearchPage } from './pages/SearchPage';
import { MessagesPage } from './pages/MessagesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || '',
            role: profile?.role || 'user',
            profileComplete: profile?.profile_complete || false,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={
              <AuthGuard requireOnboarding={true}>
                <HomePage />
              </AuthGuard>
            } />
            <Route path="/login" element={
              <AuthGuard requireAuth={false}>
                <LoginPage />
              </AuthGuard>
            } />
            <Route path="/register" element={
              <AuthGuard requireAuth={false}>
                <RegisterPage />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/messages" element={
              <AuthGuard>
                <MessagesPage />
              </AuthGuard>
            } />
            <Route path="/onboarding/user" element={
              <AuthGuard requireOnboarding={false}>
                <UserOnboardingPage />
              </AuthGuard>
            } />
            <Route path="/onboarding/business" element={
              <AuthGuard requireOnboarding={false}>
                <BusinessOnboardingPage />
              </AuthGuard>
            } />
          </Routes>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
export default App;