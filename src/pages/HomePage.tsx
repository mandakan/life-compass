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
    <div>
      <h1 className="text-2xl font-bold mb-4">Life Compass</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Data
      </button>
    </div>
  );
};

export default HomePage;
