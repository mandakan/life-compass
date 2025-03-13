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
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Life Compass</h1>
      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={handleSave}
      >
        Save Data
      </button>
    </div>
  );
};

export default HomePage;
