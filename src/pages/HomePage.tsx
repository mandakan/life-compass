import React, { useEffect } from 'react';
import { getUserData } from '../utils/storageService';
import { colors, typography, transitions } from '../designTokens';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const data = getUserData();
    console.log('Loaded user data:', data);
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: colors[theme].background,
    color: colors[theme].text,
    fontFamily: typography.primaryFont,
    padding: '2rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    transition: `background-color ${transitions.fast}`,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Life Compass</h1>
      <Link
        to="/create-life-compass"
        style={buttonStyle}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            colors.secondary;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            colors.primary;
        }}
      >
        Create Life Compass
      </Link>
    </div>
  );
};

export default HomePage;
