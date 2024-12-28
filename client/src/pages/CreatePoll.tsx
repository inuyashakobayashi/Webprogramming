import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { Label } from '@/components/ui/label';
import { pollService } from '@/services/api';
import { useToast } from "@/hooks/use-toast";

interface PollOption {
  id: number;
  text: string;
}

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: 1, text: '' },
    { id: 2, text: '' }
  ]);
  const [deadline, setDeadline] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const handleAddOption = () => {
    const newId = Math.max(...options.map(opt => opt.id), 0) + 1;
    setOptions([...options, { id: newId, text: '' }]);
  };

  const handleRemoveOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const handleOptionChange = (id: number, text: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, text } : opt
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pollData = {
        title,
        description,
        options: options.map(opt => ({ id: opt.id, text: opt.text })),
        setting: {
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
        }
      };

      const result = isLocked 
        ? await pollService.createPollock(pollData)
        : await pollService.createPollack(pollData);

      toast({
        title: "Umfrage erstellt!",
        description: "Ihre Umfrage wurde erfolgreich erstellt.",
      });

      // Zur Umfrage-Ansicht navigieren
      navigate(`/poll/${result.share.value}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: "Fehler",
        description: "Die Umfrage konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Neue Umfrage erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Was möchtest du fragen?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Gib weitere Details zu deiner Umfrage an"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Optionen</Label>
              {options.map((option) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${option.id}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddOption}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Option hinzufügen
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Sichtbarkeit</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="locked"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                />
                <label htmlFor="locked">
                  Nur für registrierte Benutzer sichtbar
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird erstellt..." : "Umfrage erstellen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePoll;