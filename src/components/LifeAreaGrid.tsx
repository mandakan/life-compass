import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import LifeAreaCard from '@components/LifeAreaCard';

export type LifeAreaGridVariant = 'desktop' | 'mobile';

export interface LifeAreaGridProps {
  areas: LifeArea[];
  variant: LifeAreaGridVariant;
  editingAreaId: string | null;
  dragOverIndex: number | null;
  onDragStart: (
    index: number,
  ) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (
    index: number,
  ) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (index: number) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (index: number) => void;
  onDragLeave: () => void;
  onEditArea: (area: LifeArea) => void;
  onRemoveArea: (id: string) => void;
  onSaveArea: (area: LifeArea) => void;
  onCancelEdit: () => void;
  onAutoUpdateRating: (
    field: 'importance' | 'satisfaction',
    newValue: number,
    area: LifeArea,
  ) => void;
  onInlineDetailsChange: (val: string, area: LifeArea) => void;
  onAddNewArea: (insertionIndex: number) => void;
}

const CONTAINER_CLASSES: Record<LifeAreaGridVariant, string> = {
  desktop:
    'mx-auto mt-4 grid max-w-[1080px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
  mobile: 'mt-4 flex flex-wrap justify-center gap-4',
};

/**
 * The single life-area card grid shared by the desktop and mobile branches.
 * The only difference between layouts is the container class set; cards and the
 * trailing "add new" tile are identical. Replaces two verbatim-duplicated
 * branches that previously lived in `CreateLifeCompass`.
 */
const LifeAreaGrid: React.FC<LifeAreaGridProps> = ({
  areas,
  variant,
  editingAreaId,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  onDragLeave,
  onEditArea,
  onRemoveArea,
  onSaveArea,
  onCancelEdit,
  onAutoUpdateRating,
  onInlineDetailsChange,
  onAddNewArea,
}) => {
  const { t } = useTranslation();
  const existingNames = areas.map(a => a.name);

  return (
    <div className={CONTAINER_CLASSES[variant]}>
      {areas.map((area, index) => (
        <div
          key={area.id}
          onDragOver={onDragOver(index)}
          onDragEnter={() => onDragEnter(index)}
          onDragLeave={onDragLeave}
          onDrop={onDrop(index)}
          className={`flex h-full w-full ${
            dragOverIndex === index
              ? 'border-2 border-dashed border-[var(--color-primary)]'
              : ''
          }`}
        >
          <LifeAreaCard
            area={area}
            isEditing={editingAreaId === area.id}
            onEdit={onEditArea}
            onRemove={onRemoveArea}
            onSave={onSaveArea}
            onCancel={onCancelEdit}
            existingNames={existingNames}
            className="w-full rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 font-sans"
            onAutoUpdateRating={onAutoUpdateRating}
            dragHandle={{
              draggable: editingAreaId === area.id ? false : true,
              onDragStart: onDragStart(index),
            }}
            onInlineDetailsChange={onInlineDetailsChange}
          />
        </div>
      ))}
      <div
        onClick={() => onAddNewArea(areas.length)}
        className="flex h-full w-full cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-[var(--color-primary)] p-4"
      >
        <span className="text-[var(--color-primary)]">
          {t('plus_add_new_life_area')}
        </span>
      </div>
    </div>
  );
};

export default LifeAreaGrid;
