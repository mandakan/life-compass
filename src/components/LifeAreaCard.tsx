import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import { FlagIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Slider from '@components/ui/Slider';
import Textarea from '@components/ui/Textarea';
import Popover from '@components/ui/Popover';
import Dialog from '@components/ui/Dialog';
import LifeAreaEditForm from './LifeAreaEditForm';
import GoalsDialog from './goals/GoalsDialog';
import { useLifeCompassStore } from '@/store/lifeCompassStore';

export interface LifeAreaCardProps {
  area: LifeArea;
  isEditing: boolean;
  onEdit: (area: LifeArea) => void;
  onRemove: (id: string) => void;
  onSave: (area: LifeArea) => void;
  onCancel: () => void;
  existingNames: string[];
  style?: React.CSSProperties;
  onAutoUpdateRating?: (
    field: 'importance' | 'satisfaction',
    newValue: number,
    area: LifeArea,
  ) => void;
  dragHandle?: React.HTMLAttributes<HTMLDivElement>;
  onInlineDetailsChange?: (val: string, area: LifeArea) => void;
  className?: string;
}

const LifeAreaCard: React.FC<LifeAreaCardProps> = ({
  area,
  isEditing,
  onEdit,
  onRemove,
  onSave,
  onCancel,
  existingNames,
  onAutoUpdateRating,
  dragHandle,
  onInlineDetailsChange,
  className,
}) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const goalCount = useLifeCompassStore(
    s => s.goals.filter(goal => goal.areaId === area.id).length,
  );
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  // Local edit draft. Owned by the card while `isEditing`; the parent only
  // tracks which area is being edited and receives the finished area on save.
  const [editName, setEditName] = useState(area.name);
  const [editDescription, setEditDescription] = useState(area.description);
  const [editDetails, setEditDetails] = useState(area.details);
  const [editImportance, setEditImportance] = useState(area.importance);
  const [editSatisfaction, setEditSatisfaction] = useState(area.satisfaction);

  const [editingDetailsInline, setEditingDetailsInline] = useState(false);
  const [inlineDetailsValue, setInlineDetailsValue] = useState(area.details);
  const inlineDetailsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingDetailsInline && inlineDetailsRef.current) {
      inlineDetailsRef.current.focus();
      const len = inlineDetailsValue.length;
      inlineDetailsRef.current.setSelectionRange(len, len);
    }
  }, [editingDetailsInline]);

  // When this card enters edit mode, seed the local draft from the live area
  // and open the desktop dialog. Using the during-render "previous prop"
  // pattern keeps the draft truthful on the rising edge of `isEditing` without
  // an extra effect commit and without clobbering in-progress typing.
  const [wasEditing, setWasEditing] = useState(isEditing);
  if (isEditing !== wasEditing) {
    setWasEditing(isEditing);
    if (isEditing) {
      setEditName(area.name);
      setEditDescription(area.description);
      setEditDetails(area.details);
      setEditImportance(area.importance);
      setEditSatisfaction(area.satisfaction);
      if (isDesktop) {
        setEditing(true);
      } else {
        setEditingDetailsInline(false);
      }
    }
  }

  const buildUpdatedArea = (): LifeArea => ({
    ...area,
    name: editName.trim(),
    description: editDescription.trim(),
    details: editDetails.trim(),
    importance: editImportance,
    satisfaction: editSatisfaction,
  });

  const handleSave = () => {
    if (editName.trim() === '') {
      return;
    }
    onSave(buildUpdatedArea());
  };

  const handleEditClick = () => {
    onEdit(area);
    if (isDesktop) {
      setEditing(true);
    }
  };

  const editFormProps = {
    area,
    editName,
    editDescription,
    editDetails,
    editImportance,
    editSatisfaction,
    onChangeEditName: setEditName,
    onChangeEditDescription: setEditDescription,
    onChangeEditDetails: setEditDetails,
    onChangeEditImportance: setEditImportance,
    onChangeEditSatisfaction: setEditSatisfaction,
    existingNames,
  };

  if (!isDesktop && isEditing) {
    return (
      <div
        className={`relative flex flex-grow flex-col rounded-sm border border-border bg-bg p-4 text-text shadow-sm transition-all ${className || ''}`}
      >
        <LifeAreaEditForm
          {...editFormProps}
          onCancelEdit={onCancel}
          onSaveEdit={handleSave}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-grow flex-col rounded-sm border border-border bg-bg p-4 text-text shadow-sm transition-all ${className || ''}`}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 cursor-grab opacity-90"
        role="img"
        aria-label={t('drag_to_reorder_life_area')}
        {...(dragHandle || {})}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <line
            x1="4"
            y1="8"
            x2="20"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="14"
            x2="20"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover
            trigger={
              <InformationCircleIcon className="h-6 w-6 flex-none shrink-0 text-primary" />
            }
            className="max-w-2xl"
          >
            {<p>{area.description}</p>}
          </Popover>
          <h4 className="text-lg font-semibold text-primary">
            {area.name}
          </h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGoalsOpen(true)}
            title={t('goals.open_goals')}
            aria-label={`${t('goals.open_goals')} ${area.name}`}
            className="flex cursor-pointer items-center gap-1 border-none bg-transparent text-text"
          >
            <FlagIcon className="size-5" />
            <span className="text-sm">{goalCount}</span>
          </button>
          <button
            onClick={handleEditClick}
            title={t('edit') || 'Edit'}
            aria-label={t('edit') || 'Edit'}
            className="cursor-pointer border-none bg-transparent"
          >
            <PencilIcon className="size-5" />
          </button>
          <button
            onClick={() => onRemove(area.id)}
            title={t('delete') || 'Delete'}
            aria-label={`${t('delete') || 'Delete'} ${area.name}`}
            className="cursor-pointer border-none bg-transparent"
          >
            <TrashIcon className="size-5" />
          </button>
        </div>
      </div>
      <div
        onClick={() => setEditingDetailsInline(true)}
        className="h-[120px] cursor-text rounded-sm bg-surface-sunken px-0 py-0 font-sans transition-colors hover:bg-surface"
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setEditingDetailsInline(true);
          }
        }}
        aria-label={t('click_to_edit_details') || 'Click to edit details'}
      >
        {editingDetailsInline ? (
          <Textarea
            ref={inlineDetailsRef}
            value={inlineDetailsValue}
            onChange={e => {
              const target = e.target as HTMLTextAreaElement;
              setInlineDetailsValue(target.value);
            }}
            onBlur={e => {
              const newValue = (e.target as HTMLTextAreaElement).value;
              if (onInlineDetailsChange) {
                onInlineDetailsChange(newValue, area);
              } else {
                setEditDetails(newValue);
              }
              setEditingDetailsInline(false);
            }}
            onKeyDown={e => {
              // Prevent propagation only for Enter and Space keydown events that trigger inline editing
              if (
                editingDetailsInline &&
                (e.key === 'Enter' || e.key === ' ')
              ) {
                // Allow default behavior for typing but stop bubbling to parent
                e.stopPropagation();
              }
            }}
            autoFocus
            className="block h-[120px] w-full flex-1 resize-none bg-surface-sunken px-2 py-1 font-sans text-base outline-none"
          />
        ) : (
          <div className="h-[120px] w-full px-2 py-1">
            <span className="whitespace-pre-wrap text-text">
              {area.details || t('click_to_edit_details')}
            </span>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <div className="mt-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">{t('importance')}</div>
            <Popover
              trigger={
                <div className="flex cursor-pointer items-center gap-1 rounded bg-surface-sunken px-2 py-0.5 text-sm text-text">
                  <span role="img" aria-label="Importance">
                    ⭐
                  </span>
                  {area.importance}/10
                </div>
              }
              side="right"
              align="center"
              contentClassName="!w-[80px] !p-2"
            >
              <Slider
                value={area.importance}
                onChange={(val: number) => {
                  if (onAutoUpdateRating) {
                    onAutoUpdateRating('importance', val, area);
                  } else {
                    setEditImportance(val);
                  }
                }}
                orientation="vertical"
                min={0}
                max={10}
                step={1}
                height={200}
              />
            </Popover>
          </div>
        </div>

        <div className="mt-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {t('lived_according_to_past_week')}
            </div>
            <Popover
              trigger={
                <div className="flex cursor-pointer items-center gap-1 rounded bg-surface-sunken px-2 py-0.5 text-sm text-text">
                  <span role="img" aria-label="Satisfaction">
                    ❤️
                  </span>
                  {area.satisfaction}/10
                </div>
              }
              side="right"
              align="center"
              contentClassName="!w-[80px] !p-2"
            >
              <Slider
                value={area.satisfaction}
                onChange={(val: number) => {
                  if (onAutoUpdateRating) {
                    onAutoUpdateRating('satisfaction', val, area);
                  } else {
                    setEditSatisfaction(val);
                  }
                }}
                orientation="vertical"
                min={0}
                max={10}
                step={1}
                height={200}
              />
            </Popover>
          </div>
        </div>
      </div>
      {isDesktop && isEditing && (
        <Dialog
          open={editing}
          onOpenChange={isOpen => {
            setEditing(isOpen);
            if (!isOpen) {
              onCancel();
            }
          }}
          title={t('edit_life_area_title')}
          description={t('edit_life_area_description')}
        >
          <LifeAreaEditForm
            {...editFormProps}
            existingNames={existingNames}
            onCancelEdit={() => {
              setEditing(false);
              onCancel();
            }}
            onSaveEdit={() => {
              if (editName.trim() === '') {
                return;
              }
              setEditing(false);
              handleSave();
            }}
          />
        </Dialog>
      )}
      <GoalsDialog area={area} open={goalsOpen} onOpenChange={setGoalsOpen} />
    </div>
  );
};

export default LifeAreaCard;
