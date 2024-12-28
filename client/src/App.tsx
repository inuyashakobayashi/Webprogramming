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
          
          {/* Pollock (authenticated) routes */}
          <Route path="/poll/lock/create" element={
            user?.lock ? <CreatePollPage isLocked={true} /> : <Navigate to="/login" />
          } />
          
          {/* Pollack (public) routes */}
          <Route path="/poll/lack/create" element={
            <CreatePollPage isLocked={false} />
          } />

          {/* Shared routes */}
          <Route path="/poll/:token" element={<PollDetailsPage user={user} />} />
          <Route path="/poll/:token/vote" element={<VotePage user={user} />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;