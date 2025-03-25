import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@components/ui/Input';
import Textarea from '@components/ui/Textarea';
import Button from '@components/ui/Button';
import Slider from '@components/ui/Slider';
import WarningMessage from '@components/WarningMessage';
import type { LifeArea } from '@models/LifeArea';

interface LifeAreaEditFormProps {
  area: LifeArea;
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
  isDuplicate: boolean;
  onAutoUpdateRating?: (
    field: 'importance' | 'satisfaction',
    newValue: number,
    area: LifeArea,
  ) => void;
}

const LifeAreaEditForm: React.FC<LifeAreaEditFormProps> = ({
  area,
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
  isDuplicate,
  onAutoUpdateRating,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold">
          {t('name')}
        </label>
        <Input
          id="name"
          value={editName}
          onChange={e => onChangeEditName(e.target.value)}
        />
        {isDuplicate && (
          <WarningMessage
            title={t('duplicate')}
            message={t('duplicate_name_not_allowed')}
          />
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-semibold"
        >
          {t('description')}
        </label>
        <Textarea
          id="description"
          value={editDescription}
          onChange={e => onChangeEditDescription(e.target.value)}
          className="min-h-[60px]"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="details" className="mb-1 block text-sm font-semibold">
          {t('details')}
        </label>
        <Textarea
          id="details"
          value={editDetails}
          onChange={e => onChangeEditDetails(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <div>
        <label
          htmlFor="importance"
          className="mb-1 block text-sm font-semibold"
        >
          {t('importance')}
        </label>
        <Slider
          id="importance"
          value={editImportance}
          onChange={val => {
            onChangeEditImportance(val);
            onAutoUpdateRating?.('importance', val, area);
          }}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div>
        <label
          htmlFor="satisfaction"
          className="mb-1 block text-sm font-semibold"
        >
          {t('lived_according_to_past_week')}
        </label>
        <Slider
          id="satisfaction"
          value={editSatisfaction}
          onChange={val => {
            onChangeEditSatisfaction(val);
            onAutoUpdateRating?.('satisfaction', val, area);
          }}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="flex gap-2">
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
