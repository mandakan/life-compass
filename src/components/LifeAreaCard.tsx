import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LifeArea } from '../types/LifeArea';
import CustomSlider from '../components/CustomSlider';
import WarningMessage from '../components/WarningMessage';
import CustomButton from '../components/CustomButton';

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
}) => {
  const { t } = useTranslation();
  const [showDescription, setShowDescription] = useState(false);
  const [localEditName, setLocalEditName] = useState(editName);
  useEffect(() => {
    setLocalEditName(editName);
  }, [editName]);

  const [highlightImportance, setHighlightImportance] = useState(false);
  const [highlightSatisfaction, setHighlightSatisfaction] = useState(false);

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
      <div className="relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all">
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
                <CustomSlider
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
                {t('satisfaction')}
                <CustomSlider
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
          <CustomButton onClick={onSaveEdit} disabled={isDuplicate}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.707 0L10.854 1.646a.5.5 0 0 1 0-.707l1-1a.5.5 0 0 1 .707 0l2.94 2.94zM4.5 13.5v-2h2l7.5-7.5-2-2L4.5 9.5v2h-2v2h2z" />
            </svg>
            {t('save')}
          </CustomButton>
          <CustomButton onClick={onCancelEdit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
            {t('cancel')}
          </CustomButton>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all">
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
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setShowDescription(true)}
                  className="mr-2 cursor-pointer border-none bg-transparent"
                  aria-label={t('show_description')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onRemove(area.id)}
                  title={t('delete')}
                  aria-label={`${t('delete')} ${area.name}`}
                  className={actionButtonClasses}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
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
                  <span className="font-sans">
                    {area.details || t('click_to_edit_details')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="mt-2 font-sans">
              <label>
                {t('importance')}
                <CustomSlider
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
                {t('satisfaction')}
                <CustomSlider
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
