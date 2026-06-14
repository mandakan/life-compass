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

// Mobile-first reflow: one column, then two, then three as width grows. The
// variant no longer changes the container layout (both branches reflow the
// same way); it is retained for prop compatibility with the page.
const CONTAINER_CLASSES =
  'mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';

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
  void variant;
  const existingNames = areas.map(a => a.name);

  return (
    <div className={CONTAINER_CLASSES}>
      {areas.map((area, index) => (
        <div
          key={area.id}
          onDragOver={onDragOver(index)}
          onDragEnter={() => onDragEnter(index)}
          onDragLeave={onDragLeave}
          onDrop={onDrop(index)}
          className={`flex h-full w-full ${
            dragOverIndex === index
              ? 'border-2 border-dashed border-primary'
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
            className="w-full rounded-lg border border-border bg-surface p-4 font-sans shadow-warm-sm"
            onAutoUpdateRating={onAutoUpdateRating}
            dragHandle={{
              draggable: editingAreaId === area.id ? false : true,
              onDragStart: onDragStart(index),
            }}
            onInlineDetailsChange={onInlineDetailsChange}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onAddNewArea(areas.length)}
        className="flex min-h-[120px] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface/40 p-4 text-primary transition-colors duration-base ease-out-soft hover:border-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <span>{t('plus_add_new_life_area')}</span>
      </button>
    </div>
  );
};

export default LifeAreaGrid;
