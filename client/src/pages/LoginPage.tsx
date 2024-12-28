import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/polls/AuthForm';
import { Registration, User } from '@/types/poll';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (data: Registration) => {
    try {
      const response = await fetch('/api/user/key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const apiKey = await response.text();
      localStorage.setItem('auth-token', apiKey);

      // Set user data
      onLogin({
        name: data.name,
        lock: true // Since this is a login, we assume it's for Pollock
      });

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto">
        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          error={error}
        />
        
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-600">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;