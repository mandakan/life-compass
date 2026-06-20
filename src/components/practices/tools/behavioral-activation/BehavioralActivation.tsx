import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '@/store/lifeCompassStore';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import Button from '@components/ui/Button';
import BehavioralActivationFlow from './BehavioralActivationFlow';
import BehavioralActivationItem from './BehavioralActivationItem';

const PREFIX = 'practices.tools.behavioral_activation';

const BehavioralActivation: React.FC = () => {
  const { t } = useTranslation();
  const records = useLifeCompassStore(s => s.behavioralActivations);
  const add = useLifeCompassStore(s => s.addBehavioralActivation);
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const [openId, setOpenId] = useState<string | null>(null);

  const handleNew = () => {
    add();
    const id = useLifeCompassStore.getState().behavioralActivations.at(-1)!.id;
    setOpenId(id);
  };

  const requestDelete = (title: string) =>
    confirm({
      title: t(`${PREFIX}.delete`),
      message: t(`${PREFIX}.delete_confirm`, { title }),
      type: 'warning',
    });

  if (openId !== null) {
    const record = records.find(r => r.id === openId);
    if (record != null) {
      return (
        <BehavioralActivationFlow
          record={record}
          onClose={() => setOpenId(null)}
        />
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

      {records.length === 0 ? (
        <p className="border-border bg-surface-sunken text-text-muted mt-6 rounded-lg border border-dashed px-4 py-6 text-center text-sm">
          {t(`${PREFIX}.empty_state`)}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {[...records].reverse().map(record => (
            <BehavioralActivationItem
              key={record.id}
              record={record}
              onEdit={() => setOpenId(record.id)}
              onRequestDelete={() =>
                requestDelete(record.activity.trim() || t(`${PREFIX}.untitled`))
              }
            />
          ))}
        </ul>
      )}

      {ConfirmationDialog}
    </div>
  );
};

export default BehavioralActivation;
