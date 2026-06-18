import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import ExperimentItem from './ExperimentItem';

const PREFIX = 'practices.tools.behavioral_experiment';

const BehavioralExperiment: React.FC = () => {
  const { t } = useTranslation();
  const experiments = useLifeCompassStore(s => s.behavioralExperiments);
  const lifeAreas = useLifeCompassStore(s => s.lifeAreas);
  const addExperiment = useLifeCompassStore(s => s.addExperiment);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [newTitle, setNewTitle] = useState('');
  const [areaId, setAreaId] = useState<string>('');

  const handleAdd = () => {
    if (newTitle.trim() === '') {
      return;
    }
    addExperiment(newTitle, areaId || undefined);
    setNewTitle('');
    setAreaId('');
  };

  const requestDelete = (title: string) =>
    confirm({
      title: t(`${PREFIX}.delete_experiment_title`),
      message: t(`${PREFIX}.delete_experiment_warning`, { title }),
      type: 'warning',
    });

  return (
    <div>
      <form
        className="flex flex-col gap-3"
        onSubmit={e => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder={t(`${PREFIX}.add_experiment_placeholder`)}
          aria-label={t(`${PREFIX}.add_experiment`)}
        />

        {lifeAreas.length > 0 && (
          <label className="text-text-muted flex min-w-0 flex-col gap-1 text-sm">
            {t(`${PREFIX}.area_label`)}
            <select
              value={areaId}
              onChange={e => setAreaId(e.target.value)}
              className="border-border bg-surface text-text focus-visible:outline-focus min-h-[44px] w-full max-w-full min-w-0 truncate rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{t(`${PREFIX}.area_none`)}</option>
              {lifeAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <Button
          type="submit"
          variant="primary"
          className="self-start"
          disabled={newTitle.trim() === ''}
        >
          {t(`${PREFIX}.add_experiment`)}
        </Button>
      </form>

      {experiments.length === 0 ? (
        <p className="border-border bg-surface-sunken text-text-muted mt-6 rounded-lg border border-dashed px-4 py-6 text-center text-sm">
          {t(`${PREFIX}.empty_state`)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {experiments.map(experiment => (
            <ExperimentItem
              key={experiment.id}
              experiment={experiment}
              onRequestDelete={() => requestDelete(experiment.title)}
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </div>
  );
};

export default BehavioralExperiment;
