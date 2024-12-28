import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoteForm from '@/components/polls/VoteForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Poll, Vote } from '@/types/poll';

const VotePage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/poll/lack/${token}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Poll not found');
          }
          throw new Error('Failed to fetch poll');
        }

        const data = await response.json();
        setPoll(data.poll);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [token]);

  const handleVote = async (voteData: Vote) => {
    try {
      const response = await fetch(`/api/vote/lack/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // Navigate to results page after successful vote
      navigate(`/poll/${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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

  // Check if poll is expired or fixed
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
      <VoteForm poll={poll} onSubmit={handleVote} />
    </div>
  );
};

export default VotePage;