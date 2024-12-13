import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import type { JobRequest } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

interface JobListProps {
  jobs: JobRequest[];
  isLoading: boolean;
}

export function JobList({ jobs, isLoading }: JobListProps) {
  const { user } = useAuthStore();

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

  return (
    <div className="space-y-4">
      {jobs?.map((job) => (
        <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm">
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

          {user?.role === 'business' && job.status === 'open' && (
            <div className="mt-4">
              <Button variant="outline">Submit Proposal</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}