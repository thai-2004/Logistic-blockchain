// frontend/src/App.jsx
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TrackShipment from './components/TrackShipment';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Logistics Blockchain</h1>
        <div className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'track' ? 'active' : ''}
            onClick={() => setActiveTab('track')}
          >
            Track Shipment
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'track' && <TrackShipment />}
      </main>
    </div>
  );
}

export default App;