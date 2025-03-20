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
      content: t('onboarding.welcome_prompt'),
    },
    {
      id: 2,
      type: 'tooltip',
      content: t('onboarding.toolbar_tooltip'),
    },
    {
      id: 3,
      type: 'tooltip',
      content: t('onboarding.settings_tooltip'),
    },
    {
      id: 4,
      type: 'modal',
      content: t('brief_life_compass_instruction_1'),
    },
    {
      id: 5,
      type: 'modal',
      content: t('brief_life_compass_instruction_2'),
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
  const detailsButtonClasses = `bg-[var(--details-bg)] text-[var(--color-text)] ${buttonBaseClasses}`;

  const nextButtonText =
    currentStep === steps.length - 1
      ? t('onboarding.finish')
      : t('onboarding.next');

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
                  {t('onboarding.with_predefined')}
                </button>
                <button
                  onClick={() => handleSelectPathway('without')}
                  className={primaryButtonClasses}
                >
                  {t('onboarding.without_predefined')}
                </button>
              </div>
            )}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button onClick={handleBack} className={primaryButtonClasses}>
                  {t('onboarding.back')}
                </button>
              )}
              <button onClick={handleSkip} className={detailsButtonClasses}>
                {t('onboarding.skip')}
              </button>
              <button onClick={handleNext} className={primaryButtonClasses}>
                {nextButtonText}
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
                  {t('onboarding.back')}
                </button>
              )}
              <button onClick={handleSkip} className={detailsButtonClasses}>
                {t('onboarding.skip')}
              </button>
              <button onClick={handleNext} className={primaryButtonClasses}>
                {nextButtonText}
              </button>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default OnboardingTutorial;
