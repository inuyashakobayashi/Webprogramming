import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/layout/Layout';
import CreatePollPage from './pages/CreatePollPage';
import PollDetailsPage from './pages/PollDetailsPage';
import VotePage from './pages/VotePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { User } from './types/poll';

const App = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const handleLogout = () => {
    setUser(undefined);
    // Clear any auth tokens or state
    localStorage.removeItem('auth-token');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            <LoginPage onLogin={handleLogin} />
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/poll/create" element={
            user?.lock ? <CreatePollPage /> : <Navigate to="/login" />
          } />
          <Route path="/poll/:token" element={<PollDetailsPage />} />
          <Route path="/poll/:token/vote" element={<VotePage />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;