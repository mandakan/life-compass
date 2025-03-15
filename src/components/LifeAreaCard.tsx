import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, transitions } from '../designTokens';
import { useTheme } from '../context/ThemeContext';

export interface LifeArea {
  id: string;
  name: string;
  description: string;
  importance: number;
  satisfaction: number;
  details: string;
}

export interface LifeAreaCardProps {
  area: LifeArea;
  isEditing: boolean;
  editName: string;
  editDescription: string;
  editImportance: number;
  editSatisfaction: number;
  editDetails: string;
  onChangeEditName: (val: string) => void;
  onChangeEditDescription: (val: string) => void;
  onChangeEditImportance: (val: number) => void;
  onChangeEditSatisfaction: (val: number) => void;
  onChangeEditDetails: (val: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: (area: LifeArea) => void;
  onRemove: (id: string) => void;
  existingNames: string[];
  style?: React.CSSProperties;
}

const defaultCardStyle: React.CSSProperties = {
  borderRadius: borderRadius.small,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  padding: spacing.medium,
  transition: `all ${transitions.medium}`,
  position: 'relative',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.small,
};

const basicButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: spacing.small,
};

const LifeAreaCard: React.FC<LifeAreaCardProps> = ({
  area,
  isEditing,
  editName,
  editDescription,
  editImportance,
  editSatisfaction,
  editDetails,
  onChangeEditName,
  onChangeEditDescription,
  onChangeEditImportance,
  onChangeEditSatisfaction,
  onChangeEditDetails,
  onSaveEdit,
  onCancelEdit,
  onEdit,
  onRemove,
  existingNames = [],
  style,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const { theme } = useTheme();

  // Local state for immediate visual feedback on name change.
  const [localEditName, setLocalEditName] = useState(editName);
  useEffect(() => {
    setLocalEditName(editName);
  }, [editName]);

  // Create card style based on theme
  const themeCardStyle: React.CSSProperties = {
    ...defaultCardStyle,
    backgroundColor:
      theme === 'light' ? colors.light.background : colors.dark.background,
    color: theme === 'light' ? colors.light.text : colors.dark.text,
    border: `1px solid ${
      theme === 'light' ? colors.neutral[300] : colors.neutral[700]
    }`,
  };

  // Extend combinedStyle to use flex layout for proper content arrangement
  const combinedStyle: React.CSSProperties = {
    ...themeCardStyle,
    ...style,
    display: 'flex',
    flexDirection: 'column',
  };

  // Determine popup width based on viewport width
  const popupWidth =
    typeof window !== 'undefined' && window.innerWidth >= 768
      ? '400px'
      : '250px';

  // Define input style using theme
  const inputStyle: React.CSSProperties = {
    marginLeft: spacing.small,
    padding: spacing.small,
    borderRadius: borderRadius.small,
    border: `1px solid ${theme === 'light' ? colors.neutral[400] : colors.neutral[600]}`,
  };

  // Define action button style used for both the save and cancel buttons.
  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.small,
    backgroundColor: theme === 'light' ? colors.primary : colors.accent,
    color: '#fff',
    border: 'none',
    padding: spacing.small,
    borderRadius: borderRadius.small,
    cursor: 'pointer',
    transition: `background-color ${transitions.fast}`,
  };

  // Compute dynamic border color for name input.
  const trimmedLocalEditName = localEditName.trim();
  const trimmedOriginalName = area.name.trim();
  let borderColor =
    theme === 'light' ? colors.neutral[400] : colors.neutral[600];

  // Exclude current area's original name from duplicate check.
  const otherNames = existingNames.filter(
    name => name.trim() !== trimmedOriginalName,
  );

  if (
    trimmedLocalEditName !== '' &&
    trimmedLocalEditName !== trimmedOriginalName
  ) {
    if (
      otherNames.some(
        name =>
          name.trim().toLowerCase() === trimmedLocalEditName.toLowerCase(),
      )
    ) {
      borderColor = 'red';
    } else {
      borderColor = 'green';
    }
  }

  const nameInputStyle: React.CSSProperties = {
    ...inputStyle,
    border: `1px solid ${borderColor}`,
  };

  // Determine if the current local name is considered duplicate (case insensitive, excluding original name).
  const isDuplicate =
    trimmedLocalEditName !== '' &&
    trimmedLocalEditName !== trimmedOriginalName &&
    otherNames.some(
      name => name.trim().toLowerCase() === trimmedLocalEditName.toLowerCase(),
    );

  if (isEditing) {
    return (
      <div style={combinedStyle}>
        <div>
          <div>
            <label>
              Namn:
              <input
                type="text"
                value={localEditName}
                onChange={e => {
                  const value = e.target.value;
                  setLocalEditName(value);
                  onChangeEditName(value);
                }}
                placeholder="Ange livsområdesnamn"
                autoFocus
                style={nameInputStyle}
              />
            </label>
            {isDuplicate && (
              <div style={{ color: 'red', marginTop: spacing.small }}>
                Dubblett: Samma namn får inte användas.
              </div>
            )}
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Beskrivning:
              <textarea
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                style={{
                  ...inputStyle,
                  width: '100%',
                  minHeight: '60px',
                }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Detaljer:
              <textarea
                value={editDetails}
                onChange={e => onChangeEditDetails(e.target.value)}
                style={{
                  ...inputStyle,
                  width: '100%',
                  minHeight: '40px',
                }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Viktighet (1-10):
              <input
                type="range"
                value={editImportance}
                onChange={e => onChangeEditImportance(Number(e.target.value))}
                min="1"
                max="10"
                step="1"
                style={{ ...inputStyle, width: '100%', padding: 0 }}
              />
              <span style={{ marginLeft: spacing.small }}>
                {editImportance}
              </span>
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Tillfredsställelse (1-10):
              <input
                type="range"
                value={editSatisfaction}
                onChange={e => onChangeEditSatisfaction(Number(e.target.value))}
                min="1"
                max="10"
                step="1"
                style={{ ...inputStyle, width: '100%', padding: 0 }}
              />
              <span style={{ marginLeft: spacing.small }}>
                {editSatisfaction}
              </span>
            </label>
          </div>
        </div>
        <div style={{ marginTop: 'auto', ...buttonContainerStyle }}>
          <button
            onClick={onSaveEdit}
            style={actionButtonStyle}
            disabled={isDuplicate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.707 0L10.854 1.646a.5.5 0 0 1 0-.707l1-1a.5.5 0 0 1 .707 0l2.94 2.94zM4.5 13.5v-2h2l7.5-7.5-2-2L4.5 9.5v2h-2v2h2z" />
            </svg>
            Spara
          </button>
          <button onClick={onCancelEdit} style={actionButtonStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
            Avbryt
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div style={combinedStyle}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: spacing.small,
            }}
          >
            <h4 style={{ margin: 0 }}>{area.name}</h4>
            <button
              onClick={() => setShowDescription(true)}
              style={{
                marginLeft: spacing.small,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Visa beskrivning"
            >
              ℹ️
            </button>
          </div>
          {showDescription && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: popupWidth,
                maxWidth: 'calc(100vw - 20px)',
                backgroundColor:
                  theme === 'light'
                    ? colors.light.background
                    : colors.dark.background,
                color: theme === 'light' ? colors.light.text : colors.dark.text,
                border: `2px solid ${theme === 'light' ? colors.primary : colors.accent}`,
                borderRadius: borderRadius.small,
                padding: spacing.medium,
                zIndex: 10,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              }}
              tabIndex={0}
              onBlur={() => setShowDescription(false)}
            >
              <p style={{ margin: 0 }}>{area.description}</p>
              <button
                onClick={() => setShowDescription(false)}
                style={{
                  marginTop: spacing.small,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Stäng
              </button>
            </div>
          )}
          {area.details && (
            <p style={{ margin: 0, marginBottom: spacing.small }}>
              Detaljer: {area.details}
            </p>
          )}
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div className="font-bold" style={{ padding: spacing.small }}>
              Viktighet:
            </div>
            <div className="text-right" style={{ padding: spacing.small }}>
              {area.importance}
            </div>
            <div className="font-bold" style={{ padding: spacing.small }}>
              Tillfredsställelse:
            </div>
            <div className="text-right" style={{ padding: spacing.small }}>
              {area.satisfaction}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 'auto', ...buttonContainerStyle }}>
          <button
            style={actionButtonStyle}
            title="Redigera"
            onClick={() => onEdit(area)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.707 0L10.854 1.646a.5.5 0 0 1 0-.707l1-1a.5.5 0 0 1 .707 0l2.94 2.94zM4.5 13.5v-2h2l7.5-7.5-2-2L4.5 9.5v2h-2v2h2z" />
            </svg>
            Redigera
          </button>
          <button
            style={actionButtonStyle}
            title="Ta bort"
            aria-label={`Ta bort ${area.name}`}
            onClick={() => onRemove(area.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2h3.086a1 1 0 0 1 .707.293l.707.707h2.828l.707-.707A1 1 0 0 1 11.414 1H14.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4h.5a.5.5 0 0 0 0-1h-10z" />
            </svg>
            Ta bort
          </button>
        </div>
      </div>
    );
  }
};

export default LifeAreaCard;
