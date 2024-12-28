import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PollForm from '@/components/polls/PollForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PollBody, PollResult } from '@/types/poll';

const CreatePollPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (pollData: PollBody) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/poll/lack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error('Failed to create poll');
      }

      const result: PollResult = await response.json();
      // Navigate to the poll view page with the share token
      navigate(`/poll/${result.share.value}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Create New Poll</h1>
      
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
          isLocked={false} 
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