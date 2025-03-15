import React from 'react';
import { colors, spacing, borderRadius, callouts } from '../designTokens';
import { useTheme } from '../context/ThemeContext';

interface CalloutProps {
  children: React.ReactNode;
  onDismiss?: () => void;
}

const Callout: React.FC<CalloutProps> = ({ children, onDismiss }) => {
  const { theme } = useTheme();

  const background =
    theme === 'light'
      ? callouts.callout.backgroundLight
      : callouts.callout.backgroundDark;
  const borderColor = callouts.callout.border;
  const textColor = theme === 'light' ? colors.light.text : colors.dark.text;

  const calloutStyle: React.CSSProperties = {
    backgroundColor: background,
    color: textColor,
    border: `1px solid ${borderColor}`,
    borderLeft: `6px solid ${borderColor}`,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    marginBottom: spacing.medium,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const dismissBtnStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={calloutStyle}>
      <span>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={dismissBtnStyle}
          aria-label="Dismissera callout"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Callout;
