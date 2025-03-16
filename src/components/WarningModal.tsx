import React from 'react';

interface WarningModalProps {
  visible: boolean;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
  visible,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 font-sans">
      <div className="max-w-[90%] min-w-[300px] rounded-md bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-lg transition-all duration-300">
        <div>{message}</div>
        <div className="mt-4 text-right">
          <button
            onClick={onCancel}
            className="mr-2 cursor-pointer rounded-sm bg-[var(--color-primary)] px-3 py-1 text-white transition-colors duration-150"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-sm bg-[var(--color-accent)] px-3 py-1 text-white transition-colors duration-150"
          >
            Fortsätt
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
