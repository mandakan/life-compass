import React, { useState } from 'react';
import Tooltip from './Tooltip';
import Modal from './Modal';

interface OnboardingStep {
  id: number;
  type: 'tooltip' | 'modal';
  content: string;
}

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    type: 'modal',
    content: "Welcome to Life Compass! Let's start the onboarding. Would you like to begin with predefined life areas?",
  },
  {
    id: 2,
    type: 'tooltip',
    content:
      'This is your dashboard where you can add and manage your life areas. Here you can see a quick overview of your current status.',
  },
  // Additional steps can be added here in the future.
];

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skipping the tutorial marks it as completed.
    onComplete();
  };

  const handleSelectPathway = (pathway: string) => {
    setSelectedPathway(pathway);
    handleNext();
  };

  const step = steps[currentStep];

  const buttonBaseClasses = "px-3 py-1 rounded";
  const primaryButtonClasses = `bg-[var(--color-primary)] text-[var(--on-primary)] ${buttonBaseClasses}`;
  const accentButtonClasses = `bg-[var(--color-accent)] text-[var(--on-accent)] ${buttonBaseClasses}`;
  const secondaryButtonClasses = `bg-[var(--color-secondary)] text-[var(--color-text)] ${buttonBaseClasses}`;

  return (
    <div className="onboarding-tutorial">
      {step.type === 'modal' && (
        <Modal onClose={handleSkip}>
          <div className="p-4">
            <p className="mb-4">{step.content}</p>
            {currentStep === 0 && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => handleSelectPathway('with')}
                  className={primaryButtonClasses}
                >
                  With Predefined Life Areas
                </button>
                <button
                  onClick={() => handleSelectPathway('without')}
                  className={accentButtonClasses}
                >
                  Without Predefined Life Areas
                </button>
              </div>
            )}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button onClick={handleBack} className={secondaryButtonClasses}>
                  Back
                </button>
              )}
              <button onClick={handleNext} className={primaryButtonClasses}>
                Next
              </button>
              <button onClick={handleSkip} className={accentButtonClasses}>
                Skip Tutorial
              </button>
            </div>
          </div>
        </Modal>
      )}
      {step.type === 'tooltip' && (
        <Tooltip onClose={handleSkip}>
          <div className="p-4">
            <p className="mb-4">{step.content}</p>
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button onClick={handleBack} className={secondaryButtonClasses}>
                  Back
                </button>
              )}
              <button onClick={handleNext} className={primaryButtonClasses}>
                Next
              </button>
              <button onClick={handleSkip} className={accentButtonClasses}>
                Skip Tutorial
              </button>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default OnboardingTutorial;
