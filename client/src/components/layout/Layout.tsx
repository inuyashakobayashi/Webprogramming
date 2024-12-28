import { ReactNode } from 'react';
import NavBar from '../polls/Navbar';
import { User } from '@/types/poll';

interface LayoutProps {
  children: ReactNode;
  user?: User;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar user={user} onLogout={onLogout} />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto text-center text-gray-500">
          &copy; {new Date().getFullYear()} Pollock/Pollack - All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default Layout;