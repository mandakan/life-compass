import React, { useState } from 'react';
import { colors, spacing, borderRadius, transitions } from '../designTokens';

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
  style?: React.CSSProperties;
}

const defaultCardStyle: React.CSSProperties = {
  border: `1px solid ${colors.neutral[300]}`,
  borderRadius: borderRadius.small,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: colors.light.background,
  padding: spacing.medium,
  transition: `all ${transitions.medium}`,
  position: 'relative',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.small,
  marginTop: spacing.medium,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: spacing.small,
};

const popupStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: colors.light.background,
  border: `1px solid ${colors.neutral[300]}`,
  borderRadius: borderRadius.small,
  padding: spacing.medium,
  zIndex: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
  style,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const combinedStyle: React.CSSProperties = { ...defaultCardStyle, ...style };

  // Determine popup width based on viewport width
  const popupWidth = (typeof window !== 'undefined' && window.innerWidth >= 768) ? '400px' : '250px';

  if (isEditing) {
    return (
      <div style={combinedStyle}>
        <div>
          <div>
            <label>
              Namn:
              <input
                type="text"
                value={editName}
                onChange={e => onChangeEditName(e.target.value)}
                style={{
                  marginLeft: spacing.small,
                  padding: spacing.small,
                  borderRadius: borderRadius.small,
                  border: `1px solid ${colors.neutral[400]}`,
                }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Beskrivning:
              <textarea
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                style={{
                  marginLeft: spacing.small,
                  padding: spacing.small,
                  borderRadius: borderRadius.small,
                  border: `1px solid ${colors.neutral[400]}`,
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
                  marginLeft: spacing.small,
                  padding: spacing.small,
                  borderRadius: borderRadius.small,
                  border: `1px solid ${colors.neutral[400]}`,
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
                type="number"
                value={editImportance}
                onChange={e => onChangeEditImportance(Number(e.target.value))}
                min="1"
                max="10"
                style={{
                  marginLeft: spacing.small,
                  padding: spacing.small,
                  borderRadius: borderRadius.small,
                  border: `1px solid ${colors.neutral[400]}`,
                }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Tillfredsställelse (1-10):
              <input
                type="number"
                value={editSatisfaction}
                onChange={e => onChangeEditSatisfaction(Number(e.target.value))}
                min="1"
                max="10"
                style={{
                  marginLeft: spacing.small,
                  padding: spacing.small,
                  borderRadius: borderRadius.small,
                  border: `1px solid ${colors.neutral[400]}`,
                }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small, display: 'flex', gap: spacing.small }}>
            <button
              onClick={onSaveEdit}
              style={{ padding: spacing.small, borderRadius: borderRadius.small, cursor: 'pointer' }}
            >
              Spara
            </button>
            <button
              onClick={onCancelEdit}
              style={{ padding: spacing.small, borderRadius: borderRadius.small, cursor: 'pointer' }}
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={combinedStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.small }}>
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
            style={{ ...popupStyle, width: popupWidth }}
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
          <p style={{ margin: 0, marginBottom: spacing.small }}>Detaljer: {area.details}</p>
        )}
        <p style={{ margin: 0, marginBottom: spacing.small }}>
          Viktighet: {area.importance} & Tillfredsställelse: {area.satisfaction}
        </p>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} title="Redigera" onClick={() => onEdit(area)}>
            ✎
          </button>
          <button style={buttonStyle} title="Ta bort" onClick={() => onRemove(area.id)}>
            ×
          </button>
        </div>
      </div>
    );
  }
};

export default LifeAreaCard;
