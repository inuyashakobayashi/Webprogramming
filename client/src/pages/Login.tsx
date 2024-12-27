import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login with:', formData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkip = () => {
    console.log('Skipping login');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="flex items-center justify-center min-h-screen w-full p-4">
        <div className="w-full max-w-[90%] sm:max-w-[440px] p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Benutzername
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Passwort
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 sm:mt-6"
            >
              Anmelden
            </Button>
          </form>

          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full mt-3 sm:mt-4"
          >
            Ohne Anmeldung fortfahren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;