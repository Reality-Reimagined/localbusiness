import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { JobList } from '../../components/jobs/JobList';
import { CreateJobModal } from '../../components/jobs/CreateJobModal';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export function JobsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { user } = useAuthStore();
  const { jobs, isLoading } = useJobs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
        {user?.role === 'user' && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Post a Job
          </Button>
        )}
      </div>

      <JobList jobs={jobs} isLoading={isLoading} />
      
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}