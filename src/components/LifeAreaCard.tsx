import React from 'react';
import { colors, spacing, borderRadius, transitions } from '../designTokens';

export interface LifeArea {
  id: string;
  name: string;
  description: string;
  rating1: number;
  rating2: number;
}

export interface LifeAreaCardProps {
  area: LifeArea;
  isEditing: boolean;
  editName: string;
  editDescription: string;
  editRating1: number;
  editRating2: number;
  onChangeEditName: (val: string) => void;
  onChangeEditDescription: (val: string) => void;
  onChangeEditRating1: (val: number) => void;
  onChangeEditRating2: (val: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: (area: LifeArea) => void;
  onRemove: (id: string) => void;
  style?: React.CSSProperties;
}

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-1.5rem',
  backgroundColor: colors.neutral[900],
  color: '#fff',
  padding: '0.25rem 0.5rem',
  borderRadius: borderRadius.small,
  fontSize: '0.75rem',
  cursor: 'pointer',
  display: 'flex',
  gap: '0.25rem',
};

const defaultCardStyle: React.CSSProperties = {
  border: `1px solid ${colors.neutral[300]}`,
  borderRadius: borderRadius.small,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: colors.light.background,
  padding: spacing.medium,
  transition: `all ${transitions.medium}`,
  position: 'relative',
};

const LifeAreaCard: React.FC<LifeAreaCardProps> = ({
  area,
  isEditing,
  editName,
  editDescription,
  editRating1,
  editRating2,
  onChangeEditName,
  onChangeEditDescription,
  onChangeEditRating1,
  onChangeEditRating2,
  onSaveEdit,
  onCancelEdit,
  onEdit,
  onRemove,
  style,
}) => {
  const combinedStyle: React.CSSProperties = { ...defaultCardStyle, ...style };

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
                style={{ marginLeft: spacing.small, padding: spacing.small, borderRadius: borderRadius.small, border: `1px solid ${colors.neutral[400]}` }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Beskrivning:
              <input
                type="text"
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                style={{ marginLeft: spacing.small, padding: spacing.small, borderRadius: borderRadius.small, border: `1px solid ${colors.neutral[400]}` }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Betyg 1 (1-10):
              <input
                type="number"
                value={editRating1}
                onChange={e => onChangeEditRating1(Number(e.target.value))}
                min="1"
                max="10"
                style={{ marginLeft: spacing.small, padding: spacing.small, borderRadius: borderRadius.small, border: `1px solid ${colors.neutral[400]}` }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small }}>
            <label>
              Betyg 2 (1-10):
              <input
                type="number"
                value={editRating2}
                onChange={e => onChangeEditRating2(Number(e.target.value))}
                min="1"
                max="10"
                style={{ marginLeft: spacing.small, padding: spacing.small, borderRadius: borderRadius.small, border: `1px solid ${colors.neutral[400]}` }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small, display: 'flex', gap: spacing.small }}>
            <button onClick={onSaveEdit} style={{ padding: spacing.small, borderRadius: borderRadius.small, cursor: 'pointer' }}>Spara</button>
            <button onClick={onCancelEdit} style={{ padding: spacing.small, borderRadius: borderRadius.small, cursor: 'pointer' }}>Avbryt</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={combinedStyle}>
        <div>
          <h4 style={{ margin: 0, marginBottom: spacing.small }}>{area.name}</h4>
          <p style={{ margin: 0, marginBottom: spacing.small }}>{area.description}</p>
          <p style={{ margin: 0, marginBottom: spacing.small }}>
            Betyg: {area.rating1} & {area.rating2}
          </p>
          <div style={{ display: 'flex', gap: spacing.small }}>
            <div style={tooltipStyle} title="Redigera" onClick={() => onEdit(area)}>
              ✎
            </div>
            <div style={tooltipStyle} title="Ta bort" onClick={() => onRemove(area.id)}>
              ×
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LifeAreaCard;
