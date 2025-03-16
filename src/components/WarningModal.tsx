import React from 'react';

interface WarningModalProps {
  visible: boolean;
  message: string;
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
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/50 font-sans">
      <div className="bg-[var(--bg)] text-[var(--text)] p-4 rounded-md min-w-[300px] max-w-[90%] shadow-lg transition-all duration-300">
        <p>{message}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onCancel}
            className="mr-2 bg-[var(--primary)] text-white px-3 py-1 rounded-sm cursor-pointer transition-colors duration-150"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className="bg-[var(--accent)] text-white px-3 py-1 rounded-sm cursor-pointer transition-colors duration-150"
          >
            Fortsätt
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
