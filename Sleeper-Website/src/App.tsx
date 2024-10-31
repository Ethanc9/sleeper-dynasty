import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DraftBoard from './components/DraftBoard';
import Matchups from './components/Matchups';
import { LeagueProvider } from './contexts/LeagueContext';
import './App.css';

function App() {
  return (
    <LeagueProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matchups" element={<Matchups />} /> {/* Remove matchupsData prop */}
          <Route path="/draft" element={<DraftBoard />} />
        </Routes>
      </Router>
    </LeagueProvider>
  );
}

export default App;