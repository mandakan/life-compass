import React, { useEffect } from 'react';
import { getUserData, saveUserData } from '../utils/storageService';
import { colors, typography, transitions } from '../designTokens';

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

  const containerStyle: React.CSSProperties = {
    backgroundColor: colors.light.background,
    color: colors.light.text,
    fontFamily: typography.primaryFont,
    padding: '2rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    transition: `background-color ${transitions.fast}`,
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Life Compass</h1>
      <button
        style={buttonStyle}
        onClick={handleSave}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.secondary;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.primary;
        }}
      >
        Save Data
      </button>
    </div>
  );
};

export default HomePage;
