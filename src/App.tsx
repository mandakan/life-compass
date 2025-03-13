import React from 'react';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <HomePage />
    </div>
  );
};

export default App;
