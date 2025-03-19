import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-[var(--color-bg)] p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="modal-close absolute top-2 right-2 text-[var(--color-text)] focus:outline-none"
          aria-label="Close modal"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
