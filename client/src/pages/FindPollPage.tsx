import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FindPollPage = ({ isLocked = false }) => {
  const [shareToken, setShareToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareToken.trim()) {
      setError('Please enter a share token');
      return;
    }

    // Navigate to the poll details page with the provided token
    navigate(`/poll/${shareToken}`);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Find Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="shareToken" className="text-sm font-medium">
                Share Token
              </label>
              <Input
                id="shareToken"
                type="text"
                value={shareToken}
                onChange={(e) => {
                  setShareToken(e.target.value);
                  setError('');
                }}
                placeholder="Enter poll share token"
                className="w-full"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Find Poll
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FindPollPage;