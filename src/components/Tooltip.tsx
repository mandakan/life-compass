import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ children, onClose }) => {
  return (
    <div
      className="tooltip-container fixed z-50 rounded bg-[var(--color-primary)] p-3 text-[var(--on-primary)] shadow-lg"
      style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="tooltip-content">{children}</div>
      <button
        onClick={onClose}
        className="tooltip-close absolute top-0 right-0 p-1 text-[var(--on-primary)] focus:outline-none"
        aria-label="Close tooltip"
      >
        X
      </button>
    </div>
  );
};

export default Tooltip;
