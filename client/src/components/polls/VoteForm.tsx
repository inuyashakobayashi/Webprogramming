import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VoteFormProps, Vote, VoteChoice } from '@/types/poll';

const VoteForm: React.FC<VoteFormProps> = ({ poll, onSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [worstOption, setWorstOption] = useState<number | null>(null);

  const handleOptionChange = (optionId: number) => {
    if (poll.body.setting?.voices === 1) {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        if (!poll.body.setting?.voices || prev.length < poll.body.setting.voices) {
          return [...prev, optionId];
        }
        return prev;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const vote: Vote = {
      choice: selectedOptions.map((id): VoteChoice => ({
        id,
        worst: worstOption === id
      }))
    };
    onSubmit(vote);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{poll.body.title}</CardTitle>
        {poll.body.description && (
          <CardDescription>{poll.body.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {poll.body.setting?.voices === 1 ? (
            <RadioGroup
              value={selectedOptions[0]?.toString()}
              onValueChange={(value) => handleOptionChange(parseInt(value))}
            >
              {poll.body.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              {poll.body.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${option.id}`}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionChange(option.id)}
                  />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              ))}
            </div>
          )}

          {poll.body.setting?.worst && (
            <div className="pt-4 border-t">
              <CardTitle className="text-base mb-4">Worst Choice</CardTitle>
              <RadioGroup
                value={worstOption?.toString()}
                onValueChange={(value) => setWorstOption(parseInt(value))}
              >
                {poll.body.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id.toString()} id={`worst-${option.id}`} />
                    <Label htmlFor={`worst-${option.id}`}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={selectedOptions.length === 0}
          >
            Submit Vote
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VoteForm;