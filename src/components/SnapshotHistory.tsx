import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLifeCompassStore } from '../store/lifeCompassStore';
import { Snapshot } from '../types/LifeCompassDocument';

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

const SnapshotRow: React.FC<{
  snapshot: Snapshot;
  onDelete: (id: string) => void;
}> = ({ snapshot, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-2 rounded border border-[var(--border)] px-3 py-2 text-sm">
      <div className="min-w-0 flex-1">
        <span className="font-medium">{formatDate(snapshot.createdAt)}</span>
        {snapshot.label && (
          <span className="ml-2 text-[var(--color-text-muted)]">
            {snapshot.label}
          </span>
        )}
        <span className="ml-2 text-[var(--color-text-muted)]">
          &mdash; {snapshot.areas.length}{' '}
          {t('snapshot_areas_count', { count: snapshot.areas.length })}
        </span>
      </div>
      <button
        onClick={() => onDelete(snapshot.id)}
        className="shrink-0 rounded px-2 py-1 text-[var(--color-accent)] hover:opacity-80 focus:outline-none focus:ring"
        aria-label={t('delete_snapshot')}
      >
        {t('delete')}
      </button>
    </div>
  );
};

const SnapshotHistory: React.FC = () => {
  const { t } = useTranslation();
  const history = useLifeCompassStore(state => state.history);
  const deleteSnapshot = useLifeCompassStore(state => state.deleteSnapshot);

  if (history.length === 0) {
    return null;
  }

  const lastSaved = history[history.length - 1];

  return (
    <section className="mt-6 font-sans text-[var(--color-text)]">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {t('snapshot_history_title')}
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          {t('snapshot_count', { count: history.length })} &middot;{' '}
          {t('snapshot_last_saved')}: {formatDate(lastSaved.createdAt)}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {[...history].reverse().map(snapshot => (
          <SnapshotRow
            key={snapshot.id}
            snapshot={snapshot}
            onDelete={deleteSnapshot}
          />
        ))}
      </div>
    </section>
  );
};

export default SnapshotHistory;
