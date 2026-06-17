import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Button from '@components/ui/Button';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import { exportData } from '@utils/exportService';
import { parseAndValidateJSON } from '@utils/importService';
import { useLifeCompassStore } from '../../store/lifeCompassStore';
import {
  CURRENT_SCHEMA_VERSION,
  type BehavioralExperiment,
  type Goal,
  type Snapshot,
  type ThoughtRecord,
} from '@models/LifeCompassDocument';
import type { LifeArea } from '@models/LifeArea';
import type { ImportedData } from 'types/importExport';

// Live data actions rendered inside the guide's "Your data" topic: export a
// copy, import one back, or delete everything. These reuse the same services
// the compass uses, so the guide both explains and does the thing.
const GuideDataActions: React.FC = () => {
  const { t } = useTranslation();
  const { confirm, ConfirmationDialog } = useConfirmDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lifeAreas = useLifeCompassStore(state => state.lifeAreas);
  const history = useLifeCompassStore(state => state.history);
  const goals = useLifeCompassStore(state => state.goals);
  const behavioralExperiments = useLifeCompassStore(
    state => state.behavioralExperiments,
  );
  const thoughtRecords = useLifeCompassStore(state => state.thoughtRecords);
  const importDocument = useLifeCompassStore(state => state.importDocument);
  const removeAllAreas = useLifeCompassStore(state => state.removeAllAreas);

  const [error, setError] = useState('');

  const handleExport = () => {
    const json = exportData({ lifeAreas, history, goals, behavioralExperiments, thoughtRecords });
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life_compass_export_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const applyImport = (fileContent: string) => {
    const result = parseAndValidateJSON(fileContent);
    if (!result.valid) {
      setError(t('import_error') + (result.errors?.join(', ') ?? ''));
      return;
    }
    const payload = result.data as ImportedData;
    importDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      lifeAreas: payload.data.lifeAreas as LifeArea[],
      history: payload.data.history as unknown as Snapshot[],
      goals: (payload.data.goals ?? []) as Goal[],
      behavioralExperiments: (payload.data.behavioralExperiments ??
        []) as BehavioralExperiment[],
      thoughtRecords: (payload.data.thoughtRecords ?? []) as ThoughtRecord[],
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/json') {
      setError(t('invalid_file_type'));
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      applyImport(e.target?.result as string);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setError(t('error_reading_file'));
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleDelete = async () => {
    const ok = await confirm({
      type: 'warning',
      title: t('guide.topics.data.actions.delete'),
      message: t('remove_all_life_areas_warning'),
      confirmLabel: t('delete_all'),
      cancelLabel: t('cancel'),
    });
    if (ok) removeAllAreas();
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2.5">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <ArrowDownTrayIcon className="h-[18px] w-[18px]" />
          {t('guide.topics.data.actions.export')}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <ArrowUpTrayIcon className="h-[18px] w-[18px]" />
          {t('guide.topics.data.actions.import')}
        </Button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <Button variant="danger" size="sm" onClick={handleDelete}>
          <TrashIcon className="h-[18px] w-[18px]" />
          {t('guide.topics.data.actions.delete')}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {ConfirmationDialog}
    </div>
  );
};

export default GuideDataActions;
