import React, { useState } from 'react';

/**
 * The set of drag handlers and state returned by {@link useDragReorder}.
 */
export interface DragReorder {
  /** Index currently hovered as a drop target, or null when nothing is over. */
  dragOverIndex: number | null;
  /** onDragStart handler factory for the draggable card at `index`. */
  handleDragStart: (
    index: number,
  ) => (event: React.DragEvent<HTMLDivElement>) => void;
  /** onDragOver handler factory for the drop zone at `index`. */
  handleDragOver: (
    index: number,
  ) => (event: React.DragEvent<HTMLDivElement>) => void;
  /** onDrop handler factory for the drop zone at `index`. */
  handleDrop: (
    index: number,
  ) => (event: React.DragEvent<HTMLDivElement>) => void;
  /** Sets the hovered drop-target index (for onDragEnter). */
  setDragOverIndex: (index: number | null) => void;
}

/**
 * Encapsulates the drag-and-drop reorder lifecycle for the life-area grid.
 *
 * The source index travels through the native DataTransfer payload, with a
 * React-state fallback (`draggedIndex`) for environments that drop the payload.
 * On a successful drop it delegates the actual move to `reorderAreas`, which is
 * the store action that owns the `lifeAreas` order.
 */
export function useDragReorder(
  reorderAreas: (fromIndex: number, toIndex: number) => void,
): DragReorder {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      const cardEl = event.currentTarget;
      if (cardEl && event.dataTransfer) {
        event.dataTransfer.setDragImage(
          cardEl,
          cardEl.clientWidth / 2,
          cardEl.clientHeight / 2,
        );
        event.dataTransfer.setData('text/plain', index.toString());
        event.dataTransfer.effectAllowed = 'move';
      }
      setDraggedIndex(index);
    };

  const handleDragOver =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
      setDragOverIndex(index);
    };

  const handleDrop =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      let draggedIdx: number | null = null;
      if (event.dataTransfer) {
        const data = event.dataTransfer.getData('text/plain');
        const parsedIndex = parseInt(data, 10);
        if (!isNaN(parsedIndex)) {
          draggedIdx = parsedIndex;
        } else {
          draggedIdx = draggedIndex;
        }
      } else {
        draggedIdx = draggedIndex;
      }
      if (draggedIdx !== null && draggedIdx !== index) {
        reorderAreas(draggedIdx, index);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

  return {
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setDragOverIndex,
  };
}
