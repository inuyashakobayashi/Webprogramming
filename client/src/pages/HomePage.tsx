import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Vote, BarChart3, Lock } from "lucide-react";
import { authService } from '@/services/AuthService';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleCreatePoll = () => {
    if (isAuthenticated) {
      // Wenn eingeloggt, zur Pollock-Erstellung
      navigate('/poll/lock/create');
    } else {
      // Wenn nicht eingeloggt, zur Pollack-Erstellung
      navigate('/poll/lack/create');
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Poll System</h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Create and participate in polls easily. Choose between Pollock for secure, authenticated polls 
          or Pollack for quick, open polls.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg"
            onClick={handleCreatePoll}
            className="flex items-center gap-2"
          >
            Create New Poll
            <ArrowRight className="w-4 h-4" />
          </Button>
          {!isAuthenticated && (
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
          <Vote className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Voting</h3>
          <p className="text-gray-600 text-center">
            Create polls in seconds with our intuitive interface. Share them instantly with anyone.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
          <BarChart3 className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
          <p className="text-gray-600 text-center">
            Watch results update instantly as votes come in. Get detailed statistics and insights.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
          <Lock className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Options</h3>
          <p className="text-gray-600 text-center">
            Choose between authenticated Pollock or quick Pollack modes for your polling needs.
          </p>
        </div>
      </div>

      {/* Types Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6" /> Pollock
          </h3>
          <p className="text-gray-600 mb-4">
            Secure, authenticated polling system:
          </p>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• User authentication required</li>
            <li>• Control over participants</li>
            <li>• Enhanced security features</li>
            <li>• Perfect for official polls</li>
          </ul>
          {isAuthenticated ? (
            <Button 
              onClick={() => navigate('/poll/lock/create')}
              className="w-full"
            >
              Create Pollock Poll
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Get Started with Pollock
            </Button>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Pollack</h3>
          <p className="text-gray-600 mb-4">
            Quick and open polling system:
          </p>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• No registration required</li>
            <li>• Instant poll creation</li>
            <li>• Easy sharing</li>
            <li>• Perfect for quick polls</li>
          </ul>
          <Button 
            variant="outline"
            onClick={() => navigate('/poll/lack/create')}
            className="w-full"
          >
            Create Quick Poll
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;