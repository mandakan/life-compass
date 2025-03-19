import React, { useEffect, useState } from 'react';
import OnboardingTutorial from './OnboardingTutorial';

interface OnboardingTutorialWrapperProps {
  onPredefinedSelected?: () => void;
}

/**
 * OnboardingTutorialWrapper integrates the onboarding tutorial into the main application flow.
 * It checks localStorage for a tutorialCompleted flag to determine if the tutorial should be
 * shown on first launch, and provides a mechanism for replaying the tutorial via settings or help.
 */
const OnboardingTutorialWrapper: React.FC<OnboardingTutorialWrapperProps> = ({ onPredefinedSelected }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check localStorage for a tutorial completed flag
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShowTutorial(false);
  };

  // This function can be exposed to the app's settings or help menu to allow replaying the tutorial.
  const replayTutorial = () => {
    localStorage.removeItem('tutorialCompleted');
    setShowTutorial(true);
  };

  return (
    <>
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <OnboardingTutorial onComplete={handleTutorialComplete} onPredefinedSelected={onPredefinedSelected} />
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingTutorialWrapper;
