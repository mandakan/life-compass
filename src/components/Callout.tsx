import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { themeVariables, callouts } from '../designTokens';

interface CalloutProps {
  children?: React.ReactNode;
  onDismiss?: () => void;
}

const Callout: React.FC<CalloutProps> = ({ children, onDismiss }) => {
  const { theme } = useTheme();
  // Get the base CSS variable mapping for the active theme.
  const baseThemeStyles = themeVariables[theme];

  // For the Callout component we want a specific background color.
  // Use the light or dark background from callouts based on current theme.
  const background =
    theme === 'dark'
      ? callouts.callout.backgroundDark
      : callouts.callout.backgroundLight;

  // Override the --bg variable with the callout background color.
  const styleWithBg = { ...baseThemeStyles, '--bg': background };

  return (
    <div
      style={styleWithBg}
      className="bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] border-l-6 rounded-sm p-2 mb-4 flex justify-between items-center font-[var(--font-primary)]"
    >
      <span>
        {children ||
          'Vi rekommenderar att hålla antalet livsområden runt 10 för bästa överblick.'}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="bg-transparent border-none cursor-pointer text-base font-[var(--font-primary)]"
          aria-label="Dismissera callout"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Callout;
