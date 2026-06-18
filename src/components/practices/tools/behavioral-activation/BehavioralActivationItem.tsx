import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { BehavioralActivation } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';

const PREFIX = 'practices.tools.behavioral_activation';

export interface BehavioralActivationItemProps {
  record: BehavioralActivation;
  onEdit: () => void;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const FIELD_CLASS = 'flex flex-col gap-1';
const LABEL_CLASS =
  'text-xs font-medium text-text-muted uppercase tracking-wide';
const VALUE_CLASS = 'text-sm text-text';

const BehavioralActivationItem: React.FC<BehavioralActivationItemProps> = ({
  record,
  onEdit,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const remove = useLifeCompassStore(s => s.removeBehavioralActivation);
  const [expanded, setExpanded] = useState(false);

  const title = record.activity.trim() || t(`${PREFIX}.untitled`);
  const status = record.done
    ? t(`${PREFIX}.status_done`)
    : t(`${PREFIX}.status_planned`);

  const when = [
    record.plannedDate,
    record.timeOfDay ? t(`${PREFIX}.step2.time_${record.timeOfDay}`) : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      remove(record.id);
    }
  };

  return (
    <li className="border-border bg-surface shadow-warm-sm rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label={
            expanded ? t(`${PREFIX}.collapse`) : t(`${PREFIX}.expand`)
          }
          className="text-text-muted duration-base ease-out-soft hover:text-text focus-visible:outline-focus -m-1 flex-none cursor-pointer rounded-md border-none bg-transparent p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {expanded ? (
            <ChevronDownIcon className="size-5" />
          ) : (
            <ChevronRightIcon className="size-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="text-text min-w-0 flex-1 cursor-pointer truncate border-none bg-transparent text-left font-medium"
          title={title}
        >
          {title}
        </button>

        <span className="text-text-muted flex-none text-xs">{status}</span>

        <div className="flex flex-none items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            title={t(`${PREFIX}.edit`)}
            aria-label={`${t(`${PREFIX}.edit`)}: ${title}`}
            className="text-text-muted duration-base ease-out-soft hover:text-text focus-visible:outline-focus cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title={t(`${PREFIX}.delete`)}
            aria-label={`${t(`${PREFIX}.delete`)}: ${title}`}
            className="text-text-muted duration-base ease-out-soft hover:text-danger focus-visible:outline-focus cursor-pointer rounded-md border-none bg-transparent p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-border mt-4 flex flex-col gap-4 border-t pt-4">
          {when && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step2.title`)}</span>
              <p className={VALUE_CLASS}>{when}</p>
            </div>
          )}
          {(record.pleasureExpected != null ||
            record.pleasureActual != null) && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.pleasure_label`)}
              </span>
              <p className={VALUE_CLASS}>
                {record.pleasureExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureExpected}`)}
                  </span>
                )}
                {record.pleasureActual != null && (
                  <span className={record.pleasureExpected != null ? 'ml-3' : ''}>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.pleasure_scale.${record.pleasureActual}`)}
                  </span>
                )}
              </p>
            </div>
          )}
          {(record.masteryExpected != null ||
            record.masteryActual != null) && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.meaning_label`)}
              </span>
              <p className={VALUE_CLASS}>
                {record.masteryExpected != null && (
                  <span>
                    {t(`${PREFIX}.step4.expected_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryExpected}`)}
                  </span>
                )}
                {record.masteryActual != null && (
                  <span className={record.masteryExpected != null ? 'ml-3' : ''}>
                    {t(`${PREFIX}.step4.actual_tag`)}:{' '}
                    {t(`${PREFIX}.meaning_scale.${record.masteryActual}`)}
                  </span>
                )}
              </p>
            </div>
          )}
          {record.outcome && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.outcome_label`)}
              </span>
              <p className={VALUE_CLASS}>{record.outcome}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default BehavioralActivationItem;
