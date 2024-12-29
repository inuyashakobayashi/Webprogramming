import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PollStatistics from '@/components/polls/PollStatistics';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import { Statistics, User } from '@/types/poll';
import { pollService } from '@/services/PollService';
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export interface PollDetailsPageProps {
  user?: User;
}

const PollDetailsPage: React.FC<PollDetailsPageProps> = ({ user }) => {
  const { token } = useParams<{ token: string }>();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchPollData = async () => {
      if (!token) return;

      try {
        const isLocked = !!user?.lock;
        const data = isLocked
          ? await pollService.getPollLockStatistics(token)
          : await pollService.getPollLackStatistics(token);
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch poll data');
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [token, user]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      // Toast nach 3 Sekunden ausblenden
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError('Failed to copy link');
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

  if (!statistics) {
    return <div>No data available</div>;
  }

  return (
    <>
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

      <ToastProvider>
        {showToast && (
          <Toast className="fixed bottom-4 right-4">
            <div className="grid gap-1">
              <ToastTitle>Success!</ToastTitle>
              <ToastDescription>
                Share link copied to clipboard
              </ToastDescription>
            </div>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </>
  );
};

export default PollDetailsPage;