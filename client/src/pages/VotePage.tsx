import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoteForm from '@/components/polls/VoteForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Poll, Vote, User } from '@/types/poll';
import { pollService } from '@/services/PollService';

interface VotePageProps {
  user?: User;
}

const VotePage: React.FC<VotePageProps> = ({ user }) => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!token) return;

      try {
        // Versuche zuerst als public poll
        const response = await pollService.getPollLackStatistics(token);
        setPoll(response.poll);
        
        // Wenn der Poll "lock" ist und wir keinen User haben, redirect zum Login
        if (response.poll.security?.visibility === 'lock' && !user?.lock) {
          navigate('/login', { state: { returnUrl: `/poll/${token}/vote` } });
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [token, user, navigate]);

  const handleVote = async (voteData: Vote) => {
    if (!token || !poll) return;

    try {
      const isLocked = poll.security?.visibility === 'lock';
      await pollService.submitVote(token, voteData, isLocked);
      navigate(`/poll/${token}`); // Navigate to results after voting
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  // Prüfe ob die Umfrage abgelaufen oder geschlossen ist
  const isExpired = poll.body.setting?.deadline 
    ? new Date(poll.body.setting.deadline) < new Date() 
    : false;

  if (isExpired || poll.body.fixed) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            {isExpired ? 'This poll has expired.' : 'This poll has been closed.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Cast Your Vote</h1>
      <VoteForm 
        poll={poll} 
        onSubmit={handleVote}
      />
    </div>
  );
};

export default VotePage;