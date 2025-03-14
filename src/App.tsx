import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-gray-100">
        <nav className="mb-4 flex space-x-4 bg-gray-800 p-4">
          <Link to="/" className="text-white">
            Home
          </Link>
          <Link to="/design-principles" className="text-white">
            Design Principles Demo
          </Link>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design-principles" element={<DesignPrinciplesDemo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
