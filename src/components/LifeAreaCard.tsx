import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import Slider from '@components/ui/Slider';
import Textarea from '@components/ui/Textarea';
import Popover from '@components/ui/Popover';
import Dialog from '@components/ui/Dialog';
import LifeAreaEditForm from './LifeAreaEditForm';

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
  onAutoUpdateRating?: (
    field: 'importance' | 'satisfaction',
    newValue: number,
    area: LifeArea,
  ) => void;
  dragHandle?: React.HTMLAttributes<HTMLDivElement>;
  onInlineDetailsChange?: (val: string, area: LifeArea) => void;
  className?: string;
}

const LifeAreaCard: React.FC<LifeAreaCardProps> = props => {
  const {
    area,
    isEditing,
    editName,
    editDescription,
    editDetails,
    editImportance,
    editSatisfaction,
    onChangeEditName,
    onChangeEditDescription,
    onChangeEditDetails,
    onChangeEditImportance,
    onChangeEditSatisfaction,
    onSaveEdit,
    onCancelEdit,
    onEdit,
    onRemove,
    existingNames,
    onAutoUpdateRating,
    dragHandle,
    onInlineDetailsChange,
    className,
  } = props;
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  const [editingDetailsInline, setEditingDetailsInline] = useState(false);
  const [inlineDetailsValue, setInlineDetailsValue] = useState(area.details);
  const inlineDetailsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingDetailsInline && inlineDetailsRef.current) {
      inlineDetailsRef.current.focus();
      const len = inlineDetailsValue.length;
      inlineDetailsRef.current.setSelectionRange(len, len);
    }
  }, [editingDetailsInline, inlineDetailsValue]);

  useEffect(() => {
    if (isEditing) {
      if (isDesktop) {
        setEditing(true);
      } else {
        setEditingDetailsInline(false);
      }
    }
  }, [isEditing, isDesktop]);

  const handleEditClick = () => {
    onEdit(area);
    if (isDesktop) {
      setEditing(true);
    }
  };

  if (!isDesktop && isEditing) {
    return (
      <div
        className={`relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all ${className || ''}`}
      >
        <LifeAreaEditForm
          {...props}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all ${className || ''}`}
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
            trigger={<InformationCircleIcon className="w-6 h-6 flex-none shrink-0 text-[var(--color-primary)]" />}
            content={<p>{area.description}</p>}
            className="max-w-2xl"
          />
          <h4 className="text-lg font-semibold text-[var(--color-primary)]">
            {area.name}
          </h4>
        </div>
        <div className="flex gap-2">
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
        className="h-[120px] cursor-text rounded-sm bg-[var(--details-bg)] px-0 py-0 font-sans transition-colors hover:bg-[var(--hover-bg)]"
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
            onChange={val => setInlineDetailsValue(val)}
            onBlur={() => {
              if (onInlineDetailsChange) {
                onInlineDetailsChange(inlineDetailsValue, area);
              } else {
                onChangeEditDetails(inlineDetailsValue);
              }
              setEditingDetailsInline(false);
            }}
            autoFocus
            className="block h-[120px] w-full flex-1 resize-none bg-[var(--details-bg)] px-2 py-1 font-sans text-base outline-none"
          />
        ) : (
          <div className="h-[120px] w-full px-2 py-1">
            <span className="whitespace-pre-wrap text-[var(--color-text)]">
              {area.details || t('click_to_edit_details')}
            </span>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <div className="mt-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {t('importance')}
              <Popover
                trigger={<QuestionMarkCircleIcon className="w-5 h-5 text-[var(--color-primary)]" />}
                content={<p>{t('importance_help')}</p>}
              />
            </div>
            <div className="flex items-center gap-1 rounded bg-[var(--details-bg)] px-2 py-0.5 text-sm text-[var(--color-text)]">
              <span role="img" aria-label="Importance">
                ⭐
              </span>
              {area.importance}/10
            </div>
          </div>
        </div>

        <div className="mt-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {t('lived_according_to_past_week')}
              <Popover
                trigger={<QuestionMarkCircleIcon className="w-5 h-5 text-[var(--color-primary)]" />}
                content={<p>{t('satisfaction_help')}</p>}
              />
            </div>
            <div className="flex items-center gap-1 rounded bg-[var(--details-bg)] px-2 py-0.5 text-sm text-[var(--color-text)]">
              <span role="img" aria-label="Satisfaction">
                ❤️
              </span>
              {area.satisfaction}/10
            </div>
          </div>
        </div>
      </div>
      {isDesktop && isEditing && (
        <Dialog
          open={editing}
          onOpenChange={setEditing}
          title={t('edit_life_area_title')}
          description={t('edit_life_area_description')}
        >
          <LifeAreaEditForm
            {...props}
            existingNames={existingNames}
            onCancelEdit={() => {
              setEditing(false);
              onCancelEdit();
            }}
            onSaveEdit={() => {
              setEditing(false);
              onSaveEdit();
            }}
          />
        </Dialog>
      )}
    </div>
  );
};

export default LifeAreaCard;
