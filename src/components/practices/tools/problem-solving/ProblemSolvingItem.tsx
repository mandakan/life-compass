import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { ProblemSolving } from '@models/LifeCompassDocument';
import { useLifeCompassStore } from '@/store/lifeCompassStore';

const PREFIX = 'practices.tools.problem_solving';

export interface ProblemSolvingItemProps {
  record: ProblemSolving;
  onEdit: () => void;
  /** Confirms removal; resolves true when the user accepts. */
  onRequestDelete: () => Promise<boolean>;
}

const FIELD_CLASS = 'flex flex-col gap-1';
const LABEL_CLASS =
  'text-xs font-medium text-text-muted uppercase tracking-wide';
const VALUE_CLASS = 'text-sm text-text';

const ProblemSolvingItem: React.FC<ProblemSolvingItemProps> = ({
  record,
  onEdit,
  onRequestDelete,
}) => {
  const { t } = useTranslation();
  const removeRecord = useLifeCompassStore(s => s.removeProblemSolving);
  const [expanded, setExpanded] = useState(false);

  const title = record.problem.trim() || t(`${PREFIX}.untitled`);
  const chosen = record.options.find(o => o.id === record.chosenOptionId);

  const handleDelete = async () => {
    const ok = await onRequestDelete();
    if (ok) {
      removeRecord(record.id);
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
          {record.options.length > 0 && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step2.title`)}</span>
              <ul className="list-disc pl-5">
                {record.options.map(opt => (
                  <li key={opt.id} className={VALUE_CLASS}>
                    {opt.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {chosen && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.choose_label`)}
              </span>
              <p className={VALUE_CLASS}>{chosen.text}</p>
            </div>
          )}
          {record.steps.length > 0 && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>
                {t(`${PREFIX}.step4.steps_intro`)}
              </span>
              <ul className="flex flex-col gap-1">
                {record.steps.map(step => (
                  <li key={step.id} className={VALUE_CLASS}>
                    {step.done ? '✓ ' : '· '}
                    {step.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {record.outcome && (
            <div className={FIELD_CLASS}>
              <span className={LABEL_CLASS}>{t(`${PREFIX}.step5.title`)}</span>
              <p className={VALUE_CLASS}>{record.outcome}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ProblemSolvingItem;
