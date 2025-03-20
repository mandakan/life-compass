import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="modal-overlay bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative w-full max-w-xl rounded bg-[var(--color-bg)] p-6 shadow-lg max-h-[90vh] overflow-y-auto"
      >
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
