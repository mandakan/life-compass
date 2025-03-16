import React, { useEffect } from 'react';
import { getUserData } from '../utils/storageService';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserData();
    console.log('Laddade användardata:', data);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-sans p-8 flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold text-center">Livskompass</h1>
      <CustomButton onClick={() => navigate("/create-life-compass")}>
        Skapa Livskompass
      </CustomButton>
    </div>
  );
};

export default HomePage;
