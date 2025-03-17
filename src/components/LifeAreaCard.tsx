import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LifeArea } from '../types/LifeArea';
import CustomSlider from '../components/CustomSlider';
import WarningMessage from '../components/WarningMessage';

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

  const actionButtonClasses =
    'flex items-center gap-2 bg-[var(--color-primary)] text-white border-none py-1 px-2 rounded-sm cursor-pointer transition-colors';

  if (isEditing) {
    return (
      <div className="relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all">
        <div>
          <div>
            <label className="font-sans">
              {t("name")}
              <input
                type="text"
                value={localEditName}
                onChange={e => {
                  const value = e.target.value;
                  setLocalEditName(value);
                  onChangeEditName(value);
                }}
                placeholder={t("enter_life_area_name")}
                autoFocus
                className={nameInputClasses}
              />
            </label>
            {isDuplicate && (
              <WarningMessage
                title={t("duplicate")}
                message={t("duplicate_name_not_allowed")}
              />
            )}
          </div>
          <div className="mt-2">
            <label className="font-sans">
              {t("description")}
              <textarea
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                className={`${commonInputClasses} min-h-[60px]`}
              />
            </label>
          </div>
          <div className="mt-2">
            <label className="font-sans">
              {t("details")}
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
                {t("importance")}
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
                {t("satisfaction")}
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
          <button
            onClick={onSaveEdit}
            className={actionButtonClasses}
            disabled={isDuplicate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.707 0L10.854 1.646a.5.5 0 0 1 0-.707l1-1a.5.5 0 0 1 .707 0l2.94 2.94zM4.5 13.5v-2h2l7.5-7.5-2-2L4.5 9.5v2h-2v2h2z" />
            </svg>
            {t("save")}
          </button>
          <button onClick={onCancelEdit} className={actionButtonClasses}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm transition-all">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 cursor-grab opacity-90"
          role="img"
          aria-label={t("drag_to_reorder_life_area")}
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
            <div className="mb-2 flex items-center">
              <button
                onClick={() => setShowDescription(true)}
                className="mr-2 cursor-pointer border-none bg-transparent"
                aria-label={t("show_description")}
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
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                {t("show_description")}
              </button>
              <h4 className="m-0 font-sans text-lg font-normal text-[var(--color-primary)]">
                {area.name}
              </h4>
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
                  {t("close")}
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
                    {area.details || t("click_to_edit_details")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="mt-2 font-sans">
              <label>
                {t("importance")}
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
                {t("satisfaction")}
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
        <div className="mt-auto flex gap-2">
          <button
            className={actionButtonClasses}
            title={t("edit")}
            onClick={() => onEdit(area)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1 1a.5.5 0 0 1-.707 0L10.854 1.646a.5.5 0 0 1 0-.707l1-1a.5.5 0 0 1 .707 0l2.94 2.94zM4.5 13.5v-2h2l7.5-7.5-2-2L4.5 9.5v2h-2v2h2z" />
            </svg>
            {t("edit")}
          </button>
          <button
            className={actionButtonClasses}
            title={t("delete")}
            aria-label={`${t("delete")} ${area.name}`}
            onClick={() => onRemove(area.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2h3.086a1 1 0 0 1 .707.293l.707.707h2.828l.707-.707A1 1 0 0 1 11.414 1H14.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4h.5a.5.5 0 0 0 0-1h-10z" />
            </svg>
            {t("delete")}
          </button>
        </div>
      </div>
    );
  }
};

export default LifeAreaCard;
