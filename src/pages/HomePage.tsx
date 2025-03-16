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
    <div className="bg-bg text-text flex min-h-screen flex-col items-center justify-center p-8 font-sans">
      <h1 className="mb-6 text-center text-2xl font-bold">Livskompass</h1>
      <CustomButton onClick={() => navigate('/create-life-compass')}>
        Skapa Livskompass
      </CustomButton>
    </div>
  );
};

export default HomePage;
