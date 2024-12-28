import { Button } from "@/components/ui/button";
import { User } from '@/types/poll';

interface NavBarProps {
  user?: User;
  onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">
                {user?.lock ? 'Pollock' : 'Pollack'}
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/polls/create"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Create Poll
              </a>
              {user && (
                <a
                  href="/polls/my"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Polls
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a href="/login">Login</a>
                </Button>
                <Button
                  size="sm"
                  asChild
                >
                  <a href="/register">Register</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;