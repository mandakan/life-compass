import React from 'react';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <HomePage />
    </div>
  );
};

export default App;
