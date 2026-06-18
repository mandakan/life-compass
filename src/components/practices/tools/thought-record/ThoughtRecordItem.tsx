import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { ThoughtRecord } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';

const PREFIX = 'practices.tools.thought_record';

export interface ThoughtRecordItemProps {
  record: ThoughtRecord;
  onEdit: () => void;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const FIELD_CLASS = 'flex flex-col gap-1';
const LABEL_CLASS =
  'text-xs font-medium text-text-muted uppercase tracking-wide';
const VALUE_CLASS = 'text-sm text-text';

const ThoughtRecordItem: React.FC<ThoughtRecordItemProps> = ({
  record,
  onEdit,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const removeThoughtRecord = useLifeCompassStore(s => s.removeThoughtRecord);
  const [expanded, setExpanded] = useState(false);

  const title = record.situation.trim() || t(`${PREFIX}.untitled`);

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      removeThoughtRecord(record.id);
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
          {record.thought && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step2.title`)}</span>
              <p className={VALUE_CLASS}>{record.thought}</p>
            </div>
          )}
          {(record.feeling || record.feelingBefore != null) && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step3.title`)}</span>
              <p className={VALUE_CLASS}>
                {record.feeling}
                {record.feelingBefore != null && (
                  <span
                    className={record.feeling ? 'text-text-muted ml-2' : ''}
                  >
                    {record.feeling ? '(' : ''}
                    {t(`${PREFIX}.feeling_scale.${record.feelingBefore}`)}
                    {record.feeling ? ')' : ''}
                  </span>
                )}
              </p>
            </div>
          )}
          {record.supports && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.supports_label`)}
              </span>
              <p className={VALUE_CLASS}>{record.supports}</p>
            </div>
          )}
          {record.widerView && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.wider_label`)}
              </span>
              <p className={VALUE_CLASS}>{record.widerView}</p>
            </div>
          )}
          {record.kinderView && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.kinder_label`)}
              </span>
              <p className={VALUE_CLASS}>{record.kinderView}</p>
            </div>
          )}
          {record.feelingAfter != null && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step5.strength_label`)}
              </span>
              <p className={VALUE_CLASS}>
                {t(`${PREFIX}.feeling_scale.${record.feelingAfter}`)}
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ThoughtRecordItem;
