import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PollForm from '@/components/polls/PollForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PollBody } from '@/types/poll';
import { pollService } from '@/services/PollService';

export interface CreatePollPageProps {
  isLocked: boolean;
}

const CreatePollPage: React.FC<CreatePollPageProps> = ({ isLocked }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (pollData: PollBody) => {
    setIsSubmitting(true);
    setError('');

    try {
      const result = isLocked 
        ? await pollService.createPollLock(pollData)
        : await pollService.createPollLack(pollData);
      
      navigate(`/poll/${result.share.value}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">
        Create New {isLocked ? 'Pollock' : 'Pollack'} Poll
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        
        <PollForm 
          onSubmit={handleSubmit} 
          isLocked={isLocked} 
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreatePollPage;