import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Textarea from '@/components/ui/Textarea';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import WarningMessage from '@/components/WarningMessage';
import type { LifeArea } from '@models/LifeArea';

interface LifeAreaEditFormProps {
  area: LifeArea;
  editName: string;
  editDescription: string;
  editDetails: string;
  editImportance: number;
  editSatisfaction: number;
  existingNames: string[];
  onChangeEditName: (val: string) => void;
  onChangeEditDescription: (val: string) => void;
  onChangeEditDetails: (val: string) => void;
  onChangeEditImportance: (val: number) => void;
  onChangeEditSatisfaction: (val: number) => void;
  onAutoUpdateRating?: (
    field: 'importance' | 'satisfaction',
    newValue: number,
    area: LifeArea,
  ) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  className?: string;
}

const LifeAreaEditForm: React.FC<LifeAreaEditFormProps> = ({
  area,
  editName,
  editDescription,
  editDetails,
  editImportance,
  editSatisfaction,
  existingNames,
  onChangeEditName,
  onChangeEditDescription,
  onChangeEditDetails,
  onChangeEditImportance,
  onChangeEditSatisfaction,
  onAutoUpdateRating,
  onSaveEdit,
  onCancelEdit,
  className,
}) => {
  const { t } = useTranslation();
  const [localEditName, setLocalEditName] = useState(editName);
  const [highlightImportance, setHighlightImportance] = useState(false);
  const [highlightSatisfaction, setHighlightSatisfaction] = useState(false);

  useEffect(() => {
    setLocalEditName(editName);
  }, [editName]);

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

  return (
    <div
      className={`relative flex flex-grow flex-col rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-sm ${className || ''}`}
    >
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
          placeholder={t('enter_life_area_name') || ''}
          autoFocus
          className={`ml-0 w-full rounded-sm border px-2 py-1 font-sans ${
            isDuplicate
              ? 'border-red-500'
              : trimmedLocalEditName !== '' &&
                  trimmedLocalEditName !== trimmedOriginalName
                ? 'border-green-500'
                : 'border-[var(--border)]'
          }`}
        />
      </label>
      {isDuplicate && (
        <WarningMessage
          title={t('duplicate')}
          message={t('duplicate_name_not_allowed')}
        />
      )}

      <label className="mt-2 font-sans">
        {t('description')}
        <Textarea
          value={editDescription}
          onChange={val => onChangeEditDescription(val)}
          className="min-h-[60px]"
        />
      </label>

      <label className="mt-2 font-sans">
        {t('details')}
        <Textarea
          value={editDetails}
          onChange={val => onChangeEditDetails(val)}
          className="min-h-[120px]"
        />
      </label>

      <div className="mt-4">
        <label className="font-sans">
          {t('importance')}
          <Slider
            value={editImportance}
            onChange={newValue => {
              onChangeEditImportance(newValue);
              setHighlightImportance(true);
              setTimeout(() => setHighlightImportance(false), 400);
              onAutoUpdateRating?.('importance', newValue, area);
            }}
            min={1}
            max={10}
            step={1}
            width="100%"
            height={40}
          />
        </label>

        <label className="mt-2 font-sans">
          {t('lived_according_to_past_week')}
          <Slider
            value={editSatisfaction}
            onChange={newValue => {
              onChangeEditSatisfaction(newValue);
              setHighlightSatisfaction(true);
              setTimeout(() => setHighlightSatisfaction(false), 400);
              onAutoUpdateRating?.('satisfaction', newValue, area);
            }}
            min={1}
            max={10}
            step={1}
            width="100%"
            height={40}
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={onSaveEdit} disabled={isDuplicate} className="w-full">
          {t('save')}
        </Button>
        <Button onClick={onCancelEdit} variant="outline" className="w-full">
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
};

export default LifeAreaEditForm;
