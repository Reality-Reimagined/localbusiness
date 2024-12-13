import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { SubmitProposalModal } from './SubmitProposalModal';
import { JobProposals } from './JobProposals';
import type { JobRequest } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

interface JobListProps {
  jobs: JobRequest[];
  isLoading: boolean;
}

export function JobList({ jobs, isLoading }: JobListProps) {
  const { user } = useAuthStore();
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <>
      <div className="space-y-4">
        {jobs?.map((job) => {
          const isExpanded = expandedJobId === job.id;
          const isJobOwner = user?.id === job.user_id;

          return (
            <div key={job.id} className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{job.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Budget: ${job.budget}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div>
                    Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {user?.role === 'business' && job.status === 'open' && (
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedJob(job)}
                    >
                      Submit Proposal
                    </Button>
                  )}
                  
                  {(isJobOwner || job.bids?.length > 0) && (
                    <Button
                      variant="ghost"
                      onClick={() => toggleJobExpansion(job.id)}
                      className="ml-auto"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Proposals</h4>
                  <JobProposals
                    jobId={job.id}
                    proposals={job.bids || []}
                    isJobOwner={isJobOwner}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <SubmitProposalModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          job={selectedJob}
        />
      )}
    </>
  );
}