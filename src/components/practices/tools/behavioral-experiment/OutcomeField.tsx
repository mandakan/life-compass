import React from 'react';
import { useTranslation } from 'react-i18next';

export interface OutcomeFieldProps {
  /** Current stored outcome. */
  value: string;
  /** Persist the outcome (called on blur). */
  onCommit: (next: string) => void;
}

const PREFIX = 'practices.tools.behavioral_experiment';

/**
 * A gentle, auto-growing reflection field. Local state keeps typing smooth; the
 * store is written on blur so we do not churn on every keystroke.
 */
const OutcomeField: React.FC<OutcomeFieldProps> = ({ value, onCommit }) => {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = React.useState(value);

  // Keep the draft in sync if the stored value changes underneath us.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(value);
  }, [value]);

  const autosize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  React.useLayoutEffect(() => {
    autosize();
  }, [draft, autosize]);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <label htmlFor="experiment-outcome" className="block text-sm font-medium text-text">
        {t(`${PREFIX}.outcome_label`)}
      </label>
      <textarea
        id="experiment-outcome"
        ref={ref}
        rows={1}
        value={draft}
        onInput={autosize}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => onCommit(draft)}
        className="mt-2 min-h-[60px] w-full resize-none overflow-hidden rounded-md border border-border bg-surface px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      />
      <p className="mt-1 text-xs text-text-muted">{t(`${PREFIX}.outcome_help`)}</p>
    </div>
  );
};

export default OutcomeField;
