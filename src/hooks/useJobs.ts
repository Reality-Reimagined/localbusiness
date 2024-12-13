import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { JobRequest } from '../types';

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery('jobs', async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        user:user_id (
          name,
          email
        ),
        bids:job_bids (
          id,
          amount,
          business:business_id (
            id,
            business_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  });

  const createJob = useMutation(
    async (jobData: Omit<JobRequest, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            ...jobData,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobs');
        toast.success('Job posted successfully');
      },
      onError: () => {
        toast.error('Failed to post job');
      },
    }
  );

  const submitBid = useMutation(
    async ({ jobId, amount, proposal }: { jobId: string; amount: number; proposal: string }) => {
      const { data, error } = await supabase
        .from('job_bids')
        .insert([
          {
            job_id: jobId,
            amount,
            proposal,
            status: 'pending',
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('jobs');
        toast.success('Bid submitted successfully');
      },
      onError: () => {
        toast.error('Failed to submit bid');
      },
    }
  );

  return {
    jobs,
    isLoading,
    createJob,
    submitBid,
  };
}