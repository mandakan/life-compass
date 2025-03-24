import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import Slider from '@/components/ui/Slider';
import Textarea from '@/components/ui/Textarea';
import Popover from '@/components/ui/Popover';
import CustomButton from '@/components/CustomButton';
import WarningMessage from '@/components/WarningMessage';
import {
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

export interface LifeAreaCardProps {
  area: LifeArea;
  isEditing: boolean;
  editName: string;
  editDescription: string;
  editDetails: string;
  editImportance: number;
  editSatisfaction: number;
  onChangeEditName: (val: string) => void;
  onChangeEditDescription: (val: string) => void;
  onChangeEditDetails: (val: string) => void;
  onChangeEditImportance: (val: number) => void;
  onChangeEditSatisfaction: (val: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: (area: LifeArea) => void;
  onRemove: (id: string) => void;
  existingNames: string[];
  style?: React.CSSProperties;
  onAutoUpdateRating?: (
    field: 'importance' | 'satisfaction',
    newValue: number,
    area: LifeArea
  ) => void;
  dragHandle?: React.HTMLAttributes<HTMLDivElement>;
  onInlineDetailsChange?: (val: string, area: LifeArea) => void;
  className?: string;
}

const LifeAreaCard: React.FC<LifeAreaCardProps> = ({
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
}) => {
  const { t } = useTranslation();
  const [localEditName, setLocalEditName] = useState(editName);
  const [editingDetailsInline, setEditingDetailsInline] = useState(false);
  const [inlineDetailsValue, setInlineDetailsValue] = useState(area.details);
  const inlineDetailsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalEditName(editName);
  }, [editName]);

  useEffect(() => {
    if (editingDetailsInline && inlineDetailsRef.current) {
      inlineDetailsRef.current.focus();
      const len = inlineDetailsValue.length;
      inlineDetailsRef.current.setSelectionRange(len, len);
    }
  }, [editingDetailsInline, inlineDetailsValue]);

  const trimmedLocalEditName = localEditName.trim();
  const trimmedOriginalName = area.name.trim();
  const otherNames = existingNames.filter(
    name => name.trim() !== trimmedOriginalName
  );

  const isDuplicate =
    trimmedLocalEditName !== '' &&
    trimmedLocalEditName !== trimmedOriginalName &&
    otherNames.some(
      name =>
        name.trim().toLowerCase() === trimmedLocalEditName.toLowerCase()
    );

  const nameInputBorderClass = isDuplicate
    ? 'border-red-500'
    : trimmedLocalEditName !== '' &&
      trimmedLocalEditName !== trimmedOriginalName
    ? 'border-green-500'
    : 'border-[var(--border)]';

  if (isEditing) {
    return (
      <div
        className={`relative flex flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all ${className || ''}`}
      >
        <label className="font-sans mb-2 block">
          {t('name')}
          <input
            type="text"
            value={localEditName}
            onChange={e => {
              const val = e.target.value;
              setLocalEditName(val);
              onChangeEditName(val);
            }}
            placeholder={t('enter_life_area_name')}
            className={`w-full rounded-sm border px-2 py-1 font-sans ${nameInputBorderClass}`}
          />
        </label>
        {isDuplicate && (
          <WarningMessage
            title={t('duplicate')}
            message={t('duplicate_name_not_allowed')}
          />
        )}

        <label className="font-sans mb-2 block">
          {t('description')}
          <Textarea
            value={editDescription}
            onChange={e => onChangeEditDescription(e.target.value)}
            className="min-h-[60px]"
          />
        </label>

        <label className="font-sans mb-2 block">
          {t('details')}
          <Textarea
            value={editDetails}
            onChange={e => onChangeEditDetails(e.target.value)}
            className="min-h-[120px]"
          />
        </label>

        <div className="mt-auto space-y-2">
          <label className="block font-sans">
            {t('importance')}
            <Slider
              value={editImportance}
              onChange={val => onChangeEditImportance(val)}
              min={1}
              max={10}
              step={1}
            />
          </label>

          <label className="block font-sans">
            {t('lived_according_to_past_week')}
            <Slider
              value={editSatisfaction}
              onChange={val => onChangeEditSatisfaction(val)}
              min={1}
              max={10}
              step={1}
            />
          </label>

          <div className="flex gap-2 pt-2">
            <CustomButton onClick={onSaveEdit} disabled={isDuplicate} className="w-full">
              {t('save')}
            </CustomButton>
            <CustomButton onClick={onCancelEdit} className="w-full">
              {t('cancel')}
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all ${className || ''}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover triggerIcon={<InformationCircleIcon className="w-5" />}>
            <p>{area.description}</p>
          </Popover>
          <h4 className="font-sans text-lg font-normal text-[var(--color-primary)]">
            {area.name}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(area)}
            className="border-none bg-transparent"
            aria-label={t('edit')}
          >
            <PencilIcon className="w-5" />
          </button>
          <button
            onClick={() => onRemove(area.id)}
            className="border-none bg-transparent"
            aria-label={t('delete')}
          >
            <TrashIcon className="w-5" />
          </button>
        </div>
      </div>

      <div
        onClick={() => setEditingDetailsInline(true)}
        className="min-h-[120px] cursor-text rounded-sm bg-[var(--details-bg)] px-2 py-1 font-sans"
      >
        {editingDetailsInline ? (
          <Textarea
            ref={inlineDetailsRef}
            value={inlineDetailsValue}
            onChange={e => setInlineDetailsValue(e.target.value)}
            onBlur={() => {
              onInlineDetailsChange?.(inlineDetailsValue, area);
              setEditingDetailsInline(false);
            }}
            autoFocus
          />
        ) : (
          <span className="whitespace-pre-wrap">
            {area.details || t('click_to_edit_details')}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <label className="block font-sans">
          <div className="flex items-center gap-1">
            {t('importance')}
            <Popover triggerIcon={<QuestionMarkCircleIcon className="w-4" />}>
              <p>{t('importance_help')}</p>
            </Popover>
          </div>
          <Slider
            value={area.importance}
            onChange={val => onAutoUpdateRating?.('importance', val, area)}
            min={1}
            max={10}
            step={1}
          />
        </label>

        <label className="block font-sans">
          <div className="flex items-center gap-1">
            {t('lived_according_to_past_week')}
            <Popover triggerIcon={<QuestionMarkCircleIcon className="w-4" />}>
              <p>{t('satisfaction_help')}</p>
            </Popover>
          </div>
          <Slider
            value={area.satisfaction}
            onChange={val => onAutoUpdateRating?.('satisfaction', val, area)}
            min={1}
            max={10}
            step={1}
          />
        </label>
      </div>
    </div>
  );
};

export default LifeAreaCard;
