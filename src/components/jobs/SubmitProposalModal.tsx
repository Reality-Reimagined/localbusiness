import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '@headlessui/react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useJobs } from '../../hooks/useJobs';
import { useAuthStore } from '../../store/useAuthStore';
import type { JobRequest } from '../../types';

const proposalSchema = z.object({
  amount: z.number().min(1, 'Bid amount must be greater than 0'),
  proposal: z.string().min(20, 'Proposal must be at least 20 characters'),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobRequest;
}

export function SubmitProposalModal({ isOpen, onClose, job }: SubmitProposalModalProps) {
  const { user } = useAuthStore();
  const { submitBid } = useJobs();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      amount: job.budget,
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    if (!user) return;

    await submitBid.mutateAsync({
      jobId: job.id,
      amount: data.amount,
      proposal: data.proposal,
    });
    
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Submit Proposal for "{job.title}"
          </Dialog.Title>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Client's Budget: ${job.budget}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Bid Amount ($)"
              type="number"
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposal Details
              </label>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                placeholder="Describe why you're the best fit for this job..."
                {...register('proposal')}
              />
              {errors.proposal && (
                <p className="mt-1 text-sm text-red-600">{errors.proposal.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Submit Proposal
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}