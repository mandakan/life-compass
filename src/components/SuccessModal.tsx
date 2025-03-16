import React from 'react';

interface SuccessModalProps {
  visible: boolean;
  message: string | React.ReactNode;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, message, onClose }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 font-sans">
      <div className="max-w-[90%] min-w-[300px] rounded-md bg-green-100 p-4 text-green-900 shadow-lg transition-all duration-300">
        <div>{message}</div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-sm bg-green-500 px-3 py-1 text-white transition-colors duration-150"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
