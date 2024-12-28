import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/polls/AuthForm';
import { Registration } from '@/types/poll';
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (data: Registration) => {
    try {
      // Create user account
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Registration successful, redirect to login
      navigate('/login', {
        state: { 
          message: 'Registration successful! Please log in with your credentials.'
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-600">
            Join us to create and manage your own polls
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthForm
          mode="register"
          onSubmit={handleSubmit}
          error={error}
        />
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-600">
            Log in here
          </a>
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Why Register?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Create and manage multiple polls</li>
            <li>• Access detailed voting statistics</li>
            <li>• Control who can participate in your polls</li>
            <li>• Edit and update your polls anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;