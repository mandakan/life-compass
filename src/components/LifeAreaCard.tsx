import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import Slider from '@/components/ui/Slider';
import Textarea from '@/components/ui/Textarea';
import Popover from '@/components/ui/Popover';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';
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
  const { t } = useTranslation();
  const [showImportanceHelp, setShowImportanceHelp] = useState(false);
  const [showSatisfactionHelp, setShowSatisfactionHelp] = useState(false);
  const [editingDetailsInline, setEditingDetailsInline] = useState(false);
  const [inlineDetailsValue, setInlineDetailsValue] = useState(
    props.area.details,
  );
  const inlineDetailsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingDetailsInline && inlineDetailsRef.current) {
      inlineDetailsRef.current.focus();
      const len = inlineDetailsValue.length;
      inlineDetailsRef.current.setSelectionRange(len, len);
    }
  }, [editingDetailsInline, inlineDetailsValue]);

  if (props.isEditing) {
    return <LifeAreaEditForm {...props} />;
  }

  return (
    <div
      className={`relative flex flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all ${props.className || ''}`}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 cursor-grab opacity-90"
        role="img"
        aria-label={t('drag_to_reorder_life_area')}
        {...(props.dragHandle || {})}
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
        <h4 className="text-lg font-semibold text-[var(--color-primary)]">
          {props.area.name}
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => props.onEdit(props.area)}
            title={t('edit')}
            aria-label={t('edit')}
            className="cursor-pointer border-none bg-transparent"
          >
            <PencilIcon className="size-5" />
          </button>
          <button
            onClick={() => props.onRemove(props.area.id)}
            title={t('delete')}
            aria-label={`${t('delete')} ${props.area.name}`}
            className="cursor-pointer border-none bg-transparent"
          >
            <TrashIcon className="size-5" />
          </button>
        </div>
      </div>

      <div
        onClick={() => setEditingDetailsInline(true)}
        className={`min-h-[120px] cursor-text rounded-sm bg-[var(--details-bg)] px-2 py-1`}
      >
        {editingDetailsInline ? (
          <Textarea
            ref={inlineDetailsRef}
            value={inlineDetailsValue}
            onChange={e => setInlineDetailsValue(e.target.value)}
            onBlur={() => {
              props.onInlineDetailsChange?.(inlineDetailsValue, props.area);
              setEditingDetailsInline(false);
            }}
          />
        ) : (
          <span className="whitespace-pre-wrap">
            {props.area.details || t('click_to_edit_details')}
          </span>
        )}
      </div>

      <div className="mt-4">
        <label className="block font-sans">
          <div className="flex items-center gap-1">
            {t('importance')}
            <Popover
              trigger={<QuestionMarkCircleIcon className="w-4 cursor-help" />}
              content={<p>{t('importance_help')}</p>}
            />
          </div>
          <Slider
            value={props.area.importance}
            onChange={val =>
              props.onAutoUpdateRating?.('importance', val, props.area)
            }
            min={1}
            max={10}
          />
        </label>
        <label className="mt-4 block font-sans">
          <div className="flex items-center gap-1">
            {t('lived_according_to_past_week')}
            <Popover
              trigger={<QuestionMarkCircleIcon className="w-4 cursor-help" />}
              content={<p>{t('satisfaction_help')}</p>}
            />
          </div>
          <Slider
            value={props.area.satisfaction}
            onChange={val =>
              props.onAutoUpdateRating?.('satisfaction', val, props.area)
            }
            min={1}
            max={10}
          />
        </label>
      </div>
    </div>
  );
};

export default LifeAreaCard;
