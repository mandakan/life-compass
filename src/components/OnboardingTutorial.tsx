import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Tooltip from './Tooltip';
import Modal from './Modal';

interface OnboardingStep {
  id: number;
  type: 'tooltip' | 'modal';
  content: string;
}

interface OnboardingTutorialProps {
  onComplete: () => void;
  onPredefinedSelected?: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  onComplete,
  onPredefinedSelected,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      type: 'modal',
      content:
        "Welcome to Life Compass!\nLet's start the onboarding. Would you like to begin with predefined life areas?\n(You can always run the tutorial again from the settings menu.)",
    },
    {
      id: 2,
      type: 'tooltip',
      content:
        'This is your dashboard where you can add and manage your life areas.\nHere you can see a quick overview of your current status.',
    },
    {
      id: 3,
      type: 'tooltip',
      content:
        'Take a look at the floating toolbar in the bottom right. It gives you quick access to actions like adding a new life area, resetting, importing data, and toggling the radar view.',
    },
    {
      id: 4,
      type: 'modal',
      content: t('brief_life_compass_intruction'),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleSelectPathway = (pathway: string) => {
    setSelectedPathway(pathway);
    if (pathway === 'with' && onPredefinedSelected) {
      onPredefinedSelected();
    }
    handleNext();
  };

  const step = steps[currentStep];

  const buttonBaseClasses = 'px-3 py-1 rounded';
  const primaryButtonClasses = `bg-[var(--color-primary)] text-[var(--on-primary)] ${buttonBaseClasses}`;
  const accentButtonClasses = `bg-[var(--color-accent)] text-[var(--on-accent)] ${buttonBaseClasses}`;
  const secondaryButtonClasses = `bg-[var(--color-secondary)] text-[var(--color-text)] ${buttonBaseClasses}`;

  return (
    <div className="onboarding-tutorial">
      {step.type === 'modal' && (
        <Modal onClose={handleSkip}>
          <div className="p-4">
            <div className="mb-4">
              <ReactMarkdown>{step.content}</ReactMarkdown>
            </div>
            {currentStep === 0 && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => handleSelectPathway('with')}
                  className={primaryButtonClasses}
                >
                  With Predefined Life Areas (recommended)
                </button>
                <button
                  onClick={() => handleSelectPathway('without')}
                  className={primaryButtonClasses}
                >
                  Without Predefined Life Areas
                </button>
              </div>
            )}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button onClick={handleBack} className={primaryButtonClasses}>
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
            <div className="mb-4">
              <ReactMarkdown>{step.content}</ReactMarkdown>
            </div>
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button onClick={handleBack} className={primaryButtonClasses}>
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
