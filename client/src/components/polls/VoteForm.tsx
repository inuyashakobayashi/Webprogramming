import React, { useState } from 'react';
import { Poll, Vote, User, VoteChoice } from '@/types/poll';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface VoteFormProps {
  poll: Poll;
  onSubmit: (vote: Vote) => void;
  user?: User;
}

const VoteForm: React.FC<VoteFormProps> = ({ poll, onSubmit, user }) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());
  const [worstOptions, setWorstOptions] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>('');

  const handleOptionToggle = (optionId: number) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
      // Also remove from worst options if it was there
      const newWorst = new Set(worstOptions);
      newWorst.delete(optionId);
      setWorstOptions(newWorst);
    } else {
      // Check if we haven't exceeded the maximum allowed voices
      if (poll.body.setting?.voices && newSelected.size >= poll.body.setting.voices) {
        setError(`You can only select up to ${poll.body.setting.voices} options`);
        return;
      }
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
    setError('');
  };

  const handleWorstToggle = (optionId: number) => {
    if (!selectedOptions.has(optionId)) return; // Can only mark as worst if selected
    const newWorst = new Set(worstOptions);
    if (newWorst.has(optionId)) {
      newWorst.delete(optionId);
    } else {
      newWorst.add(optionId);
    }
    setWorstOptions(newWorst);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedOptions.size === 0) {
      setError('Please select at least one option');
      return;
    }

    // Format the vote data according to the API requirements
    const choices: VoteChoice[] = Array.from(selectedOptions).map(optionId => ({
      id: optionId,
      worst: worstOptions.has(optionId)
    }));

    const voteData: Vote = {
      owner: {
        name: user?.name || 'anonymous',
        lock: !!user?.lock
      },
      choice: choices
    };

    console.log('Submitting vote with data:', voteData);
    onSubmit(voteData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          {poll.body.options.map((option) => (
            <div key={option.id} className="flex items-start space-x-4 p-2">
              <div className="flex items-center h-5">
                <Checkbox
                  id={`option-${option.id}`}
                  checked={selectedOptions.has(option.id)}
                  onCheckedChange={() => handleOptionToggle(option.id)}
                />
              </div>
              <div className="flex-grow">
                <Label htmlFor={`option-${option.id}`}>
                  {option.text}
                </Label>
              </div>
              {poll.body.setting?.worst && selectedOptions.has(option.id) && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`worst-${option.id}`}
                    checked={worstOptions.has(option.id)}
                    onCheckedChange={() => handleWorstToggle(option.id)}
                  />
                  <Label htmlFor={`worst-${option.id}`}>Worst</Label>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Submit Vote
      </Button>
    </form>
  );
};

export default VoteForm;