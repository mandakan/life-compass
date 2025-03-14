import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPrinciplesDemo from './pages/DesignPrinciplesDemo';

const App: React.FC = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex space-x-4 mb-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/design-principles" className="text-white">Design Principles Demo</Link>
        </nav>
        <div>
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
