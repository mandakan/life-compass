import React from 'react';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';

interface SuccessModalProps {
  visible: boolean;
  message: string | React.ReactNode;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  message,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/30 font-sans">
      <div className="max-w-[90%] min-w-[300px] rounded-md bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-lg transition-all duration-300">
        <div>{message}</div>
        <div className="mt-4 text-right">
          <CustomButton onClick={onClose}>{t("ok")}</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
