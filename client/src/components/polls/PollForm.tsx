import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PollOption {
  id: number;
  text: string;
}

interface PollSettings {
  voices: number;
  worst: boolean;
  deadline: string;
}

interface PollData {
  title: string;
  description: string;
  options: PollOption[];
  setting: PollSettings;
}

interface PollFormProps {
  onSubmit: (data: PollData) => void;
  isLocked?: boolean;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit, isLocked = false }) => {
  const [pollData, setPollData] = useState<PollData>({
    title: '',
    description: '',
    options: [{ id: 1, text: '' }, { id: 2, text: '' }],
    setting: {
      voices: 1,
      worst: false,
      deadline: ''
    }
  });

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, { id: prev.options.length + 1, text: '' }]
    }));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollData.options];
    newOptions[index] = { ...newOptions[index], text: value };
    setPollData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(pollData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isLocked ? 'Create Pollock Poll' : 'Create Pollack Poll'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              value={pollData.title}
              onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What is your favorite color?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={pollData.description}
              onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide additional context for your poll"
              className="min-h-24"
            />
          </div>

          <div className="space-y-4">
            <Label>Options</Label>
            {pollData.options.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
            <Button 
              type="button" 
              onClick={addOption}
              variant="outline"
              className="w-full"
            >
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voices">Number of Voices</Label>
            <Input
              id="voices"
              type="number"
              min="1"
              value={pollData.setting.voices}
              onChange={(e) => setPollData(prev => ({
                ...prev,
                setting: { ...prev.setting, voices: parseInt(e.target.value) }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={pollData.setting.deadline}
              onChange={(e) => setPollData(prev => ({
                ...prev,
                setting: { ...prev.setting, deadline: e.target.value }
              }))}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PollForm;