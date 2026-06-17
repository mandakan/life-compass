import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Button from '@components/ui/Button';
import ThoughtRecordFlow from './ThoughtRecordFlow';
import ThoughtRecordItem from './ThoughtRecordItem';

const PREFIX = 'practices.tools.thought_record';

const ThoughtRecord: React.FC = () => {
  const { t } = useTranslation();
  const thoughtRecords = useLifeCompassStore(s => s.thoughtRecords);
  const addThoughtRecord = useLifeCompassStore(s => s.addThoughtRecord);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [openId, setOpenId] = useState<string | null>(null);

  const handleNew = () => {
    addThoughtRecord();
    const id = useLifeCompassStore.getState().thoughtRecords.at(-1)!.id;
    setOpenId(id);
  };

  const requestDelete = (situation: string) =>
    confirm({
      title: t(`${PREFIX}.delete`),
      message: t(`${PREFIX}.delete`),
      type: 'warning',
    });

  if (openId !== null) {
    const record = thoughtRecords.find(r => r.id === openId);
    // If for some reason the record was removed, fall back to list
    if (record != null) {
      return (
        <ThoughtRecordFlow record={record} onClose={() => setOpenId(null)} />
      );
    }
  }

  return (
    <div>
      <div className="flex flex-col items-start gap-3">
        <Button variant="primary" onClick={handleNew}>
          {t(`${PREFIX}.new`)}
        </Button>
      </div>

      {thoughtRecords.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface-sunken px-4 py-6 text-center text-sm text-text-muted">
          {t(`${PREFIX}.empty_state`)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {[...thoughtRecords].reverse().map(record => (
            <ThoughtRecordItem
              key={record.id}
              record={record}
              onEdit={() => setOpenId(record.id)}
              onRequestDelete={() =>
                requestDelete(record.situation || t(`${PREFIX}.untitled`))
              }
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </div>
  );
};

export default ThoughtRecord;
