import React, { useEffect, useState } from 'react';
import OnboardingTutorial from './OnboardingTutorial';

/**
 * OnboardingTutorialWrapper integrates the onboarding tutorial into the main application flow.
 * It checks localStorage for a tutorialCompleted flag to determine if the tutorial should be
 * shown on first launch, and provides a mechanism for replaying the tutorial via settings or help.
 */
const OnboardingTutorialWrapper: React.FC = () => {
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
      {showTutorial && <OnboardingTutorial onComplete={handleTutorialComplete} />}
      {/* Temporary UI control for replaying the tutorial; 
          In production, this should be integrated within the settings or help menu */}
      {!showTutorial && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={replayTutorial}
            className="bg-[var(--menu-bg)] text-[var(--menu-text)] px-3 py-2 rounded shadow focus:outline-none focus:ring"
            aria-label="Replay onboarding tutorial"
          >
            Replay Tutorial
          </button>
        </div>
      )}
    </>
  );
};

export default OnboardingTutorialWrapper;
