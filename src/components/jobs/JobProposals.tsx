import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

interface JobProposal {
  id: string;
  amount: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  business: {
    id: string;
    business_name: string;
    user_id: string;
  };
}

interface JobProposalsProps {
  jobId: string;
  proposals: JobProposal[];
  isJobOwner: boolean;
}

export function JobProposals({ jobId, proposals, isJobOwner }: JobProposalsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleProposalAction = async (proposalId: string, action: 'accepted' | 'rejected') => {
    try {
      const { error: proposalError } = await supabase
        .from('job_bids')
        .update({ status: action })
        .eq('id', proposalId);

      if (proposalError) throw proposalError;

      if (action === 'accepted') {
        // Update job status to in-progress
        const { error: jobError } = await supabase
          .from('jobs')
          .update({ status: 'in-progress' })
          .eq('id', jobId);

        if (jobError) throw jobError;
      }

      queryClient.invalidateQueries(['jobs']);
      toast.success(`Proposal ${action}`);
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal');
    }
  };

  const startChat = async (businessUserId: string) => {
    try {
      // Create or get existing chat thread
      const { data: existingChat, error: chatError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${businessUserId},receiver_id.eq.${businessUserId}`)
        .limit(1);

      if (chatError) throw chatError;

      if (existingChat && existingChat.length > 0) {
        navigate(`/messages?chat=${businessUserId}`);
      } else {
        // Start new chat
        navigate(`/messages/new?recipient=${businessUserId}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (!proposals.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No proposals yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{proposal.business.business_name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Bid Amount: ${proposal.amount}
              </p>
              <p className="text-sm text-gray-500 mt-2">{proposal.proposal}</p>
              <p className="text-xs text-gray-400 mt-2">
                Submitted {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`text-sm px-2 py-1 rounded-full ${
                proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {proposal.status}
              </span>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startChat(proposal.business.user_id)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                
                {isJobOwner && proposal.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handleProposalAction(proposal.id, 'accepted')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleProposalAction(proposal.id, 'rejected')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}