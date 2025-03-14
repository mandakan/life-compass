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
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg shadow-lg p-8 max-w-md w-full">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
        Life Compass
      </h1>
      <button
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded transition-colors"
        onClick={handleSave}
      >
        Save Data
      </button>
    </div>
  );
};

export default HomePage;
