import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface CalloutProps {
  children?: React.ReactNode;
  onDismiss?: () => void;
}

const Callout: React.FC<CalloutProps> = ({ children, onDismiss }) => {
  return (
    <div className="bg-bg text-text border border-border border-l-6 rounded-sm p-2 mb-4 flex justify-between items-center font-primary">
      <span>
        {children ||
          'Vi rekommenderar att hålla antalet livsområden runt 10 för bästa överblick.'}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="bg-transparent border-none cursor-pointer text-base font-primary"
          aria-label="Dismissera callout"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Callout;
