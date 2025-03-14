import React, { useEffect } from 'react';
import { getUserData, saveUserData } from '../utils/storageService';

const HomePage: React.FC = () => {
  useEffect(() => {
    const data = getUserData();
    console.log('Loaded user data:', data);
  }, []);

  const handleSave = () => {
    const sampleData = { name: 'User', updated: new Date().toISOString() };
    saveUserData(sampleData);
    console.log('User data saved.');
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-gradient-to-br from-gray-50 to-gray-200 p-8 shadow-lg">
      <h1 className="mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-center text-3xl font-bold text-transparent">
        Life Compass
      </h1>
      <button
        className="w-full rounded bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition-colors hover:from-blue-600 hover:to-blue-700"
        onClick={handleSave}
      >
        Save Data
      </button>
    </div>
  );
};

export default HomePage;
