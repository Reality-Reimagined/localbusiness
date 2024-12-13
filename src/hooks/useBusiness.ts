import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

export function useBusiness() {
  const navigate = useNavigate();

  const updateBusinessProfile = useMutation(
    async (profileData: any) => {
      const { data } = await api.put('/api/business/profile', profileData);
      return data;
    },
    {
      onSuccess: () => {
        toast.success('Business profile updated successfully');
        navigate('/');
      },
      onError: () => {
        toast.error('Failed to update business profile');
      },
    }
  );

  const getBusinesses = useQuery('businesses', async () => {
    const { data } = await api.get('/api/businesses');
    return data;
  });

  const getBusiness = (id: string) =>
    useQuery(['business', id], async () => {
      const { data } = await api.get(`/api/businesses/${id}`);
      return data;
    });

  return {
    updateBusinessProfile,
    getBusinesses,
    getBusiness,
  };
}