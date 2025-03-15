import React from 'react';
import { colors, spacing, borderRadius, transitions } from '../designTokens';

interface WarningModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ visible, message, onConfirm, onCancel }) => {
  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: colors.light.background,
    color: colors.light.text,
    padding: spacing.medium,
    borderRadius: borderRadius.medium || '8px',
    minWidth: '300px',
    maxWidth: '90%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: `all ${transitions.medium}`,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    color: '#fff',
    border: 'none',
    padding: spacing.small,
    borderRadius: borderRadius.small,
    cursor: 'pointer',
    transition: `background-color ${transitions.fast}`,
    marginRight: spacing.small,
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.accent,
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p>{message}</p>
        <div style={{ marginTop: spacing.medium, textAlign: 'right' }}>
          <button onClick={onCancel} style={cancelButtonStyle}>
            Avbryt
          </button>
          <button onClick={onConfirm} style={buttonStyle}>
            Fortsätt
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
