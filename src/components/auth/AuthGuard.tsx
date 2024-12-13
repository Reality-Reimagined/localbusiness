import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requireOnboarding = true 
}: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user && requireAuth) {
      // Save the attempted URL
      navigate('/login', { state: { from: location } });
    } else if (user && !user.profileComplete && requireOnboarding) {
      navigate(`/onboarding/${user.role}`);
    }
  }, [user, navigate, location, requireAuth, requireOnboarding]);

  // Show nothing while checking auth status
  if (!user && requireAuth) return null;
  if (user && !user.profileComplete && requireOnboarding) return null;

  return <>{children}</>;
}