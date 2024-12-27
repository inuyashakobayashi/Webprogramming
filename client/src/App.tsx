

import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import CreatePoll from './pages/CreatePoll'
function App() {
  

  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-poll" element={<CreatePoll />} />
        </Routes>
      </Router>
    </>
  )
}

export default App