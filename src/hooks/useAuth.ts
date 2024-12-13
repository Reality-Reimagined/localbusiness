import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, logout: logoutStore } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch additional user data from profiles
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: profile.name || '',
            role: profile.role || 'user',
            profileComplete: profile.profile_complete || false,
          });

          // Redirect based on profile completion status
          if (!profile.profile_complete) {
            navigate(`/onboarding/${profile.role}`);
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: credentials.name,
            role: credentials.role,
            profile_complete: false,
          });

        if (profileError) throw profileError;

        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: credentials.name,
          role: credentials.role,
          profileComplete: false,
        });

        navigate(`/onboarding/${credentials.role}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      logoutStore();
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  return {
    login,
    register,
    logout,
  };
}