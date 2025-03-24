import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import Slider from '@/components/ui/Slider';
import WarningMessage from '@components/WarningMessage';
import CustomButton from '@components/CustomButton';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';
import {
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

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
  existingNames = [],
  onAutoUpdateRating,
  dragHandle,
  onInlineDetailsChange,
  className,
}) => {
  const { t } = useTranslation();
  const [showDescription, setShowDescription] = useState(false);
  const [showImportanceHelp, setShowImportanceHelp] = useState(false);
  const [showSatisfactionHelp, setShowSatisfactionHelp] = useState(false);
  const [localEditName, setLocalEditName] = useState(editName);
  useEffect(() => {
    setLocalEditName(editName);
  }, [editName]);

  const [_highlightImportance, setHighlightImportance] = useState(false);
  const [_highlightSatisfaction, setHighlightSatisfaction] = useState(false);

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

  const popupWidthClass = 'w-[250px] md:w-[400px] max-w-[calc(100vw-20px)]';

  const trimmedLocalEditName = localEditName.trim();
  const trimmedOriginalName = area.name.trim();
  const otherNames = existingNames.filter(
    name => name.trim() !== trimmedOriginalName,
  );

  const isDuplicate =
    trimmedLocalEditName !== '' &&
    trimmedLocalEditName !== trimmedOriginalName &&
    otherNames.some(
      name => name.trim().toLowerCase() === trimmedLocalEditName.toLowerCase(),
    );

  const nameInputBorderClass = isDuplicate
    ? 'border-red-500'
    : trimmedLocalEditName !== '' &&
        trimmedLocalEditName !== trimmedOriginalName
      ? 'border-green-500'
      : 'border-[var(--border)]';

  const nameInputClasses = `ml-0 px-2 py-1 rounded-sm border w-full font-sans ${nameInputBorderClass}`;

  const commonInputClasses =
    'ml-0 px-2 py-1 rounded-sm border border-[var(--border)] w-full font-sans';

  const actionButtonClasses = 'cursor-pointer border-none bg-transparent';

  if (isEditing) {
    return (
      <div
        className={`relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all ${className || ''}`}
      >
        <div>
          <div>
            <label className="font-sans">
              {t('name')}
              <input
                type="text"
                value={localEditName}
                onChange={e => {
                  const value = e.target.value;
                  setLocalEditName(value);
                  onChangeEditName(value);
                }}
                placeholder={t('enter_life_area_name')}
                autoFocus
                className={nameInputClasses}
              />
            </label>
            {isDuplicate && (
              <WarningMessage
                title={t('duplicate')}
                message={t('duplicate_name_not_allowed')}
              />
            )}
          </div>
          <div className="mt-2">
            <label className="font-sans">
              {t('description')}
              <textarea
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                className={`${commonInputClasses} min-h-[60px]`}
              />
            </label>
          </div>
          <div className="mt-2">
            <label className="font-sans">
              {t('details')}
              <textarea
                value={editDetails}
                onChange={e => onChangeEditDetails(e.target.value)}
                className={`${commonInputClasses} min-h-[120px]`}
              />
            </label>
          </div>
          <div className="mt-auto">
            <div className="mt-2 font-sans">
              <label>
                {t('importance')}
                <Slider
                  value={editImportance}
                  onChange={newValue => {
                    onChangeEditImportance(newValue);
                    setHighlightImportance(true);
                    setTimeout(() => {
                      setHighlightImportance(false);
                    }, 400);
                    if (onAutoUpdateRating) {
                      onAutoUpdateRating('importance', newValue, area);
                    }
                  }}
                  min={1}
                  max={10}
                  step={1}
                  width="100%"
                  height={40}
                />
              </label>
            </div>
            <div className="mt-2 font-sans">
              <label>
                {t('lived_according_to_past_week')}
                <Slider
                  value={editSatisfaction}
                  onChange={newValue => {
                    onChangeEditSatisfaction(newValue);
                    setHighlightSatisfaction(true);
                    setTimeout(() => {
                      setHighlightSatisfaction(false);
                    }, 400);
                    if (onAutoUpdateRating) {
                      onAutoUpdateRating('satisfaction', newValue, area);
                    }
                  }}
                  min={1}
                  max={10}
                  step={1}
                  width="100%"
                  height={40}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-auto flex gap-2">
          <CustomButton
            onClick={onSaveEdit}
            disabled={isDuplicate}
            className="w-full"
          >
            {t('save')}
          </CustomButton>
          <CustomButton onClick={onCancelEdit} className="w-full">
            {t('cancel')}
          </CustomButton>
        </div>
      </div>
    );
  } else {
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
        <div className="flex flex-grow flex-col">
          <div className="mb-2 flex h-full items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setShowDescription(true)}
                className="mr-2 cursor-pointer border-none bg-transparent"
                aria-label={t('show_description')}
              >
                <InformationCircleIcon className="h-6 w-6" />
              </button>
              <h4 className="m-0 font-sans text-lg font-normal text-[var(--color-primary)]">
                {area.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(area)}
                title={t('edit')}
                aria-label={t('edit')}
                className={actionButtonClasses}
              >
                <PencilIcon className="size-6" />
              </button>
              <button
                onClick={() => onRemove(area.id)}
                title={t('delete')}
                aria-label={`${t('delete')} ${area.name}`}
                className={actionButtonClasses}
              >
                <TrashIcon className="size-6" />
              </button>
            </div>
          </div>
          {showDescription && (
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 transform ${popupWidthClass} z-10 rounded-sm border-2 border-[var(--color-accent)] bg-[var(--color-bg)] p-4 font-sans text-[var(--color-text)] shadow-lg`}
              tabIndex={0}
              onBlur={() => setShowDescription(false)}
            >
              <p className="m-0 font-sans">{area.description}</p>
              <button
                onClick={() => setShowDescription(false)}
                className="mt-2 cursor-pointer border-none bg-transparent font-sans"
              >
                {t('close')}
              </button>
            </div>
          )}
          {showImportanceHelp && (
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 transform ${popupWidthClass} z-10 rounded-sm border-2 border-[var(--color-accent)] bg-[var(--color-bg)] p-4 font-sans text-[var(--color-text)] shadow-lg`}
              tabIndex={0}
              onBlur={() => setShowImportanceHelp(false)}
            >
              <p className="m-0 font-sans">
                {t('importance_help', 'Importance')}
              </p>
              <button
                onClick={() => setShowImportanceHelp(false)}
                className="mt-2 cursor-pointer border-none bg-transparent font-sans"
              >
                {t('close')}
              </button>
            </div>
          )}
          {showSatisfactionHelp && (
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 transform ${popupWidthClass} z-10 rounded-sm border-2 border-[var(--color-accent)] bg-[var(--color-bg)] p-4 font-sans text-[var(--color-text)] shadow-lg`}
              tabIndex={0}
              onBlur={() => setShowSatisfactionHelp(false)}
            >
              <p className="m-0 font-sans">
                {t('satisfaction_help', 'Satisfaction')}
              </p>
              <button
                onClick={() => setShowSatisfactionHelp(false)}
                className="mt-2 cursor-pointer border-none bg-transparent font-sans"
              >
                {t('close')}
              </button>
            </div>
          )}
          <div className="mb-2">
            <div
              onClick={() => setEditingDetailsInline(true)}
              className={`min-h-[120px] ${editingDetailsInline ? 'flex' : ''} cursor-text rounded-sm bg-[var(--details-bg)] px-2 py-1 font-sans`}
            >
              {editingDetailsInline ? (
                <textarea
                  ref={inlineDetailsRef}
                  value={inlineDetailsValue}
                  onChange={e => {
                    setInlineDetailsValue(e.target.value);
                  }}
                  onBlur={() => {
                    if (onInlineDetailsChange) {
                      onInlineDetailsChange(inlineDetailsValue, area);
                    } else {
                      onChangeEditDetails(inlineDetailsValue);
                    }
                    setEditingDetailsInline(false);
                  }}
                  autoFocus
                  className="block w-full flex-1 resize-none bg-[var(--details-bg)] px-0 py-0 font-sans outline-none"
                />
              ) : (
                <span className="font-sans whitespace-pre-wrap">
                  {area.details || t('click_to_edit_details')}
                </span>
              )}
            </div>
          </div>
          <div className="mt-auto">
            <div className="mt-2 font-sans">
              <label>
                <div className="flex gap-1">
                  {t('importance')}
                  <QuestionMarkCircleIcon
                    onClick={() => setShowImportanceHelp(true)}
                    className="w-5"
                  />
                </div>
                <Slider
                  value={area.importance}
                  onChange={newValue => {
                    if (onAutoUpdateRating) {
                      onAutoUpdateRating('importance', newValue, area);
                    }
                    setHighlightImportance(true);
                    setTimeout(() => {
                      setHighlightImportance(false);
                    }, 400);
                  }}
                  min={1}
                  max={10}
                  step={1}
                  width="100%"
                  height={40}
                />
              </label>
            </div>
            <div className="mt-2 font-sans">
              <label>
                <div className="flex gap-1">
                  {t('lived_according_to_past_week')}
                  <QuestionMarkCircleIcon
                    onClick={() => setShowSatisfactionHelp(true)}
                    className="w-5"
                  />
                </div>
                <Slider
                  value={area.satisfaction}
                  onChange={newValue => {
                    if (onAutoUpdateRating) {
                      onAutoUpdateRating('satisfaction', newValue, area);
                    }
                    setHighlightSatisfaction(true);
                    setTimeout(() => {
                      setHighlightSatisfaction(false);
                    }, 400);
                  }}
                  min={1}
                  max={10}
                  step={1}
                  width="100%"
                  height={40}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LifeAreaCard;
