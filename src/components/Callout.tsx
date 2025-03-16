import React from 'react';

interface CalloutProps {
  children?: React.ReactNode;
  onDismiss?: () => void;
}

const Callout: React.FC<CalloutProps> = ({ children, onDismiss }) => {
  return (
    <div className="mb-4 mt-4 flex items-center justify-between rounded-sm border border-l-6 border-[var(--border)] bg-[var(--color-bg)] p-2 font-sans text-[var(--color-text)]">
      <span>
        {children ||
          'Vi rekommenderar att hålla antalet livsområden runt 10 för bästa överblick.'}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="cursor-pointer border-none bg-transparent font-sans text-base"
          aria-label="Dismissera callout"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Callout;
