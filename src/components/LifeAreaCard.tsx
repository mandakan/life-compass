import React, { useState, useEffect, useRef } from 'react';
import CustomSlider from '../components/CustomSlider';
import { LifeArea } from './LifeAreaCardTypes';

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

  const popupWidthClass = "w-[250px] md:w-[400px] max-w-[calc(100vw-20px)]";

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

  // Compute class for name input border: default uses theme variable --border,
  // if changed and non duplicate, use green border; if duplicate, red border.
  const nameInputBorderClass = isDuplicate
    ? "border-red-500"
    : (trimmedLocalEditName !== "" && trimmedLocalEditName !== trimmedOriginalName)
      ? "border-green-500"
      : "border-[var(--border)]";

  const nameInputClasses = `ml-2 px-2 py-1 rounded-sm border font-sans ${nameInputBorderClass}`;

  const commonInputClasses = "ml-2 px-2 py-1 rounded-sm border border-[var(--border)] w-full font-sans";

  const actionButtonClasses = "flex items-center gap-2 bg-[var(--accent)] text-white border-none py-1 px-2 rounded-sm cursor-pointer transition-colors";

  if (isEditing) {
    return (
      <div className="rounded-sm shadow-sm p-4 transition-all relative flex flex-col flex-grow bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]">
        <div>
          <div>
            <label className="font-sans">
              Namn:
              <input
                type="text"
                value={localEditName}
                onChange={e => {
                  const value = e.target.value;
                  setLocalEditName(value);
                  onChangeEditName(value);
                }}
                placeholder="Ange livsområdesnamn"
                autoFocus
                className={nameInputClasses}
              />
            </label>
            {isDuplicate && (
              <div className="text-red-500 mt-2 font-sans">
                Dubblett: Samma namn får inte användas.
              </div>
            )}
          </div>
          <div className="mt-2">
            <label className="font-sans">
              Beskrivning:
              <textarea
                value={editDescription}
                onChange={e => onChangeEditDescription(e.target.value)}
                className={`${commonInputClasses} min-h-[60px]`}
              />
            </label>
          </div>
          <div className="mt-2">
            <label className="font-sans">
              Detaljer:
              <textarea
                value={editDetails}
                onChange={e => onChangeEditDetails(e.target.value)}
                className={`${commonInputClasses} min-h-[40px]`}
              />
            </label>
          </div>
          <div className="mt-auto">
            <div className="mt-2 font-sans">
              <label>
                Betydelse
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
                Tillfredsställelse
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
            Spara
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
            Avbryt
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="rounded-sm shadow-sm p-4 transition-all relative flex flex-col flex-grow bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]">
        <div
          className="absolute top-2 left-2.5 cursor-grab opacity-90"
          role="img"
          aria-label="Drag to reorder life area"
          {...(dragHandle || {})}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <title>Drag to reorder life area</title>
            <circle cx="4" cy="3" r="1.5" />
            <circle cx="12" cy="3" r="1.5" />
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="12" cy="8" r="1.5" />
            <circle cx="4" cy="13" r="1.5" />
            <circle cx="12" cy="13" r="1.5" />
          </svg>
        </div>
        <div className="flex flex-col flex-grow">
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={() => setShowDescription(true)}
                className="mr-2 bg-transparent border-none cursor-pointer"
                aria-label="Visa beskrivning"
              >
                ℹ️
              </button>
              <h4 className="m-0 font-sans text-lg font-normal text-[var(--accent)]">
                {area.name}
              </h4>
            </div>
            {showDescription && (
              <div
                className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${popupWidthClass} bg-[var(--bg)] text-[var(--text)] border-2 border-[var(--accent)] rounded-sm p-4 z-10 shadow-lg font-sans`}
                tabIndex={0}
                onBlur={() => setShowDescription(false)}
              >
                <p className="m-0 font-sans">{area.description}</p>
                <button
                  onClick={() => setShowDescription(false)}
                  className="mt-2 bg-transparent border-none cursor-pointer font-sans"
                >
                  Stäng
                </button>
              </div>
            )}
            <div className="mb-2">
              <div
                onClick={() => setEditingDetailsInline(true)}
                className="bg-[var(--details-bg)] px-2 py-1 rounded-sm cursor-text font-sans min-h-[100px]"
              >
                {editingDetailsInline ? (
                  <div className="flex flex-col h-full">
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
                      className="w-full px-2 py-1 outline-none resize-none font-sans bg-[var(--details-bg)]"
                    />
                  </div>
                ) : (
                  <span className="font-sans">
                    {area.details || 'Klicka för att redigera detaljer'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="mt-2 font-sans">
              <label>
                Betydelse
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
                Tillfredsställelse
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
            title="Redigera"
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
            Redigera
          </button>
          <button
            className={actionButtonClasses}
            title="Ta bort"
            aria-label={`Ta bort ${area.name}`}
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
            Ta bort
          </button>
        </div>
      </div>
    );
  }
};

export default LifeAreaCard;
