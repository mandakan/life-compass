import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding from '@components/guide/Onboarding';
import { markOnboardingSeen } from '@utils/storageService';

// The immersive first-run welcome, rendered without the app chrome (App.tsx
// hides the header and footer on this route). Reaching the end - or skipping -
// marks the tour as seen and hands off to the compass, where a brand-new
// visitor lands on the area picker and a returning one lands in the app.
const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  // Start at the top: the previous scroll position from another route would
  // otherwise leave the immersive flow scrolled down.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const finish = () => {
    markOnboardingSeen();
    navigate('/');
  };

  return <Onboarding onFinish={finish} />;
};

export default WelcomePage;
