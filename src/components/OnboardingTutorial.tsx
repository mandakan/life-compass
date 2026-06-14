import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Dialog from '@components/ui/Dialog';
import Button from '@components/ui/Button';

interface OnboardingStep {
  id: number;
  type: 'tooltip' | 'modal';
  content: string;
  title?: string;
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
  const [_selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      type: 'modal',
      content: t('onboarding.welcome_prompt'),
    },
    {
      id: 2,
      type: 'modal',
      content: t('onboarding.privacy_notice'),
    },
    {
      id: 3,
      type: 'modal',
      content: t('brief_life_compass_instruction_1'),
    },
    {
      id: 4,
      type: 'modal',
      content: t('brief_life_compass_instruction_2'),
    },
    {
      id: 5,
      type: 'modal',
      content: t('onboarding.actions'),
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

  const isLastStep = currentStep === steps.length - 1;
  const nextButtonText = isLastStep
    ? t('onboarding.finish')
    : t('onboarding.next');

  const stepBody = (
    <>
      <div className="space-y-4 text-base leading-relaxed text-text [&_a]:underline">
        <ReactMarkdown>{step.content}</ReactMarkdown>
      </div>

      {currentStep === 0 && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => handleSelectPathway('with')}
          >
            {t('onboarding.with_predefined')}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => handleSelectPathway('without')}
          >
            {t('onboarding.without_predefined')}
          </Button>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {currentStep > 0 ? (
            <Button variant="secondary" onClick={handleBack}>
              {t('onboarding.back')}
            </Button>
          ) : (
            <span />
          )}
          <Button variant="primary" onClick={handleNext}>
            {nextButtonText}
          </Button>
        </div>
        {!isLastStep && (
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            {t('onboarding.skip')}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <div className="onboarding-tutorial">
      <Dialog
        open
        title={step.title ?? t('onboarding.title', 'Onboarding')}
        // Radix requests close on Escape or outside interaction; treat that as
        // completing the tutorial so focus is returned and the overlay closes.
        onOpenChange={openState => {
          if (!openState) onComplete();
        }}
      >
        {stepBody}
      </Dialog>
    </div>
  );
};

export default OnboardingTutorial;
