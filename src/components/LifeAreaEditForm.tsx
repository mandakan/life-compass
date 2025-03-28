import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@components/ui/Input';
import Textarea from '@components/ui/Textarea';
import Button from '@components/ui/Button';
import Slider from '@components/ui/Slider';
import WarningMessage from '@components/WarningMessage';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import Popover from '@components/ui/Popover';
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
  existingNames: string[];
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
  existingNames,
  onAutoUpdateRating,
}) => {
  const { t } = useTranslation();

  const trimmedEditName = editName.trim().toLowerCase();
  const trimmedOriginalName = area.name.trim().toLowerCase();

  const isDuplicate =
    trimmedEditName !== '' &&
    trimmedEditName !== trimmedOriginalName &&
    existingNames.map(n => n.trim().toLowerCase()).includes(trimmedEditName);

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
          <label htmlFor="name" className="cursor-pointer">
            {t('name')}
          </label>
          <Popover
            trigger={
              <QuestionMarkCircleIcon className="w-5 text-[var(--color-primary)]" />
            }
          >
            <p>{t('name_help')}</p>
          </Popover>
        </div>
        <Input
          id="name"
          value={editName}
          onChange={e => onChangeEditName(e.target.value)}
        />
        {isDuplicate && (
          <WarningMessage
            title={t('duplicate')}
            message={t('duplicate_name_not_allowed')}
            data-testid="warning-message"
          />
        )}
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
          <label htmlFor="description" className="cursor-pointer">
            {t('description')}
          </label>
          <Popover
            trigger={
              <QuestionMarkCircleIcon className="w-5 text-[var(--color-primary)]" />
            }
          >
            <p>{t('description_help')}</p>
          </Popover>
        </div>
        <Textarea
          id="description"
          value={editDescription}
          onChange={e => onChangeEditDescription(e.target.value)}
          className="min-h-[60px] text-sm"
        />
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
          <label htmlFor="details" className="cursor-pointer">
            {t('details')}
          </label>
          <Popover
            trigger={
              <QuestionMarkCircleIcon className="w-5 text-[var(--color-primary)]" />
            }
          >
            <p>{t('details_help')}</p>
          </Popover>
        </div>
        <Textarea
          id="details"
          value={editDetails}
          onChange={e => onChangeEditDetails(e.target.value)}
          className="min-h-[120px] text-sm"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
          <label htmlFor="importance" className="cursor-pointer">
            {t('importance')}
          </label>
          <Popover
            trigger={
              <QuestionMarkCircleIcon className="w-5 text-[var(--color-primary)]" />
            }
          >
            <p>{t('importance_help')}</p>
          </Popover>
        </div>
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
        <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
          <label htmlFor="satisfaction" className="cursor-pointer">
            {t('lived_according_to_past_week')}
          </label>
          <Popover
            trigger={
              <QuestionMarkCircleIcon className="w-5 text-[var(--color-primary)]" />
            }
          >
            <p>{t('satisfaction_help')}</p>
          </Popover>
        </div>
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
