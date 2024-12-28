import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PollCard from '@/components/polls/PollCard';
import { Poll } from '@/types/poll';
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // Assuming there's an API endpoint to fetch public polls
        const response = await fetch('/api/polls/public');
        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }

        const data = await response.json();
        setPolls(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load polls');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Poll System</h1>
        <p className="text-gray-600 mb-8">
          Create and participate in polls easily. Get instant results and insights.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/poll/create')}
        >
          Create New Poll
        </Button>
      </div>

      {/* Recent Polls Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Polls</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : polls.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No polls available yet. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <PollCard
                key={poll.share.value}
                poll={poll}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
          <p className="text-gray-600">Create polls in seconds with our intuitive interface</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
          <p className="text-gray-600">Watch results update instantly as votes come in</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
          <p className="text-gray-600">Optional authentication for controlled polling</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;