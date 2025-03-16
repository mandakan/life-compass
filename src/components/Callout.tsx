import React from 'react';

interface CalloutProps {
  children?: React.ReactNode;
  onDismiss?: () => void;
}

const Callout: React.FC<CalloutProps> = ({ children, onDismiss }) => {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--border)] border-l-6 rounded-sm p-2 mb-4 flex justify-between items-center font-sans">
      <span>
        {children ||
          'Vi rekommenderar att hålla antalet livsområden runt 10 för bästa överblick.'}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="bg-transparent border-none cursor-pointer text-base font-sans"
          aria-label="Dismissera callout"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Callout;
