// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PollsPage from './pages/PollsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PollsPage />} />
      </Routes>
    </Router>
  );
}

export default App;