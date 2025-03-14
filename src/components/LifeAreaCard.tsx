import React from 'react';
import { colors, spacing, borderRadius } from '../designTokens';

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
  if (isEditing) {
    return (
      <div style={style}>
        <div style={{ padding: spacing.small }}>
          <div>
            <label>
              Namn:
              <input
                type="text"
                value={editName}
                onChange={e => onChangeEditName(e.target.value)}
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Beskrivning:
              <input
                type="text"
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Betyg 1 (1-10):
              <input
                type="number"
                value={editRating1}
                onChange={e => onChangeEditRating1(Number(e.target.value))}
                min="1"
                max="10"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Betyg 2 (1-10):
              <input
                type="number"
                value={editRating2}
                onChange={e => onChangeEditRating2(Number(e.target.value))}
                min="1"
                max="10"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div style={{ marginTop: spacing.small, display: 'flex', gap: spacing.small }}>
            <button onClick={onSaveEdit}>Spara</button>
            <button onClick={onCancelEdit}>Avbryt</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={style}>
        <div style={{ padding: spacing.small }}>
          <h4>{area.name}</h4>
          <p>{area.description}</p>
          <p>
            Betyg: {area.rating1} & {area.rating2}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
```^^^^

src/pages/CreateLifeCompass.tsx
