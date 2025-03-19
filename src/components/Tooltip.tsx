import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ children, onClose }) => {
  return (
    <div className="tooltip-container fixed p-3 bg-gray-800 text-white rounded shadow-lg z-50" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="tooltip-content">{children}</div>
      <button onClick={onClose} className="tooltip-close absolute top-0 right-0 p-1 text-white">
        X
      </button>
    </div>
  );
};

export default Tooltip;
