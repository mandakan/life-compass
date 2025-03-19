import React, { useState } from 'react';
import Tooltip from './Tooltip';
import Modal from './Modal';

interface OnboardingStep {
  id: number;
  type: 'tooltip' | 'modal';
  content: string;
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

const OnboardingTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the tutorial if needed.
      // This could involve hiding the tutorial or navigating the user away.
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Logic for skipping the tutorial.
    // This could set a flag in user preferences or simply hide the component.
  };

  const handleSelectPathway = (pathway: string) => {
    setSelectedPathway(pathway);
    handleNext();
  };

  const step = steps[currentStep];

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
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  With Predefined Life Areas
                </button>
                <button
                  onClick={() => handleSelectPathway('without')}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Without Predefined Life Areas
                </button>
              </div>
            )}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button onClick={handleBack} className="bg-gray-300 text-black px-3 py-1 rounded">
                  Back
                </button>
              )}
              <button onClick={handleNext} className="bg-blue-500 text-white px-3 py-1 rounded">
                Next
              </button>
              <button onClick={handleSkip} className="bg-red-500 text-white px-3 py-1 rounded">
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
                <button onClick={handleBack} className="bg-gray-300 text-black px-3 py-1 rounded">
                  Back
                </button>
              )}
              <button onClick={handleNext} className="bg-blue-500 text-white px-3 py-1 rounded">
                Next
              </button>
              <button onClick={handleSkip} className="bg-red-500 text-white px-3 py-1 rounded">
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
