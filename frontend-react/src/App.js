import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
