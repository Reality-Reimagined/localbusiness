import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export function useUser() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const { data: currentUser } = useQuery(
    'currentUser',
    async () => {
      if (!user) return null;
      const { data } = await api.get('/api/users/me');
      return data;
    },
    {
      enabled: !!user,
      onError: () => {
        // Handle token expiration or other auth errors
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
      },
    }
  );

  const updateProfile = useMutation(
    async (profileData: any) => {
      const { data } = await api.put('/api/users/profile', profileData);
      return data;
    },
    {
      onSuccess: (data) => {
        setUser(data);
        toast.success('Profile updated successfully');
        navigate('/');
      },
      onError: () => {
        toast.error('Failed to update profile');
      },
    }
  );

  return {
    currentUser,
    updateProfile,
  };
}