import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PollStatistics from '@/components/polls/PollStatistics';
import { Statistics } from '@/types/poll';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

const PollDetailsPage = () => {
  const { token } = useParams<{ token: string }>();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await fetch(`/api/poll/lack/${token}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Poll not found');
          }
          throw new Error('Failed to fetch poll data');
        }

        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [token]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    // You might want to add a toast notification here
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

  if (!statistics) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Poll Results</h1>
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share Poll
        </Button>
      </div>

      <PollStatistics statistics={statistics} />

      {!statistics.poll.body.fixed && (
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <a href={`/poll/${token}/vote`}>Vote Now</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PollDetailsPage;