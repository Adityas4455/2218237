import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <header style={{ backgroundColor: '#1976d2', color: 'white', padding: '1rem' }}>
          <h1> url shorter </h1>
          <nav>
            <a href="/" style={{ color: 'white', marginRight: '20px' }}>Home</a>
            <a href="/stats" style={{ color: 'white' }}>Statistics</a>
          </nav>
        </header>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </Router>
      
    </div>
  );
}

export default App;