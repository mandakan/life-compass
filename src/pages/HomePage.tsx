import React, { useEffect } from 'react';
import { getUserData } from '../utils/storageService';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  useEffect(() => {
    const data = getUserData();
    console.log('Laddade användardata:', data);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans p-8 flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold text-center">Livskompass</h1>
      <Link
        to="/create-life-compass"
        className="bg-primary hover:bg-secondary text-white rounded px-6 py-3 transition-colors duration-150 cursor-pointer no-underline inline-block"
      >
        Skapa Livskompass
      </Link>
    </div>
  );
};

export default HomePage;
