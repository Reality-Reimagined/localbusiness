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
    async (jobData: Omit<JobRequest, 'id' | 'created_at'> & { user_id: string }) => {
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
      onError: (error: any) => {
        console.error('Job creation error:', error);
        toast.error(error.message || 'Failed to post job');
      },
    }
  );

  const submitBid = useMutation(
    async ({ jobId, amount, proposal }: { jobId: string; amount: number; proposal: string }) => {
      // First get the business profile ID for the current user
      const { data: businessProfile, error: profileError } = await supabase
        .from('business_profiles')
        .select('id')
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from('job_bids')
        .insert([
          {
            job_id: jobId,
            business_id: businessProfile.id,
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
        toast.success('Proposal submitted successfully');
      },
      onError: (error: any) => {
        console.error('Bid submission error:', error);
        toast.error(error.message || 'Failed to submit proposal');
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