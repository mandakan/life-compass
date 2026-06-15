import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import type { Snapshot } from '@models/LifeCompassDocument';
import {
  matters,
  lived,
  fromBucket,
  reflectionKey,
  LIVED_KEY,
  MATTERS_KEY,
} from '@utils/compassModel';
import Button from '@components/ui/Button';
import Textarea from '@components/ui/Textarea';
import ScaleChooser from './ScaleChooser';

export interface AreaDetailProps {
  area: LifeArea;
  /** Newly-added area: autofocus the name and treat blank names as untitled. */
  isNew: boolean;
  /** Snapshot history, reserved for derived context. */
  history: Snapshot[];
  onClose: () => void;
  /** Apply a partial change to the live area. */
  onChange: (changes: Partial<LifeArea>) => void;
  onRemove: (id: string) => void;
  /** Optional quiet affordance to open the goals dialog for this area. */
  onOpenGoals?: () => void;
}

/**
 * The calm bottom-sheet area editor. Built on the Radix Dialog primitive so we
 * get focus-trap, Escape, and a scrim for free, but aligned to the bottom of
 * the viewport with top-rounded corners and a grab handle.
 *
 * Edits map back to the 1-10 store via the compassModel adapter: a matters pill
 * writes { importance }, a lived pill writes { satisfaction }, and ONLY on an
 * explicit pill tap, so untouched areas keep their exact stored value.
 */
const AreaDetail: React.FC<AreaDetailProps> = ({
  area,
  isNew,
  history: _history,
  onClose,
  onChange,
  onRemove,
  onOpenGoals,
}) => {
  const { t } = useTranslation();
  const [nameFocus, setNameFocus] = React.useState(false);

  // The description holds anything from a few words to a full sentence (the
  // predefined areas ship long prompts), so it wraps in an auto-growing
  // textarea rather than clipping in a single-line input.
  const descRef = React.useRef<HTMLTextAreaElement>(null);
  const autosizeDescription = React.useCallback(() => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);
  React.useLayoutEffect(() => {
    autosizeDescription();
  }, [area.description, autosizeDescription]);

  const mattersValue = matters(area);
  const livedValue = lived(area);

  const mattersLabels = [1, 2, 3, 4, 5].map(n => t(MATTERS_KEY(n)));
  const livedLabels = [1, 2, 3, 4, 5].map(n => t(LIVED_KEY(n)));

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <RadixDialog.Root open onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <RadixDialog.Content
          aria-label={isNew ? t('your_compass.detail.new_area_aria') : area.name}
          className="fixed bottom-0 left-1/2 z-50 max-h-[92vh] w-full max-w-[600px] -translate-x-1/2 overflow-y-auto rounded-t-xl border border-border bg-surface text-text shadow-warm-md"
          style={{
            padding:
              '20px clamp(20px, 5vw, 28px) calc(28px + env(safe-area-inset-bottom))',
          }}
        >
          {/* Grab handle + close. The handle centers in the row; the 44x44
              close button overlaps to the right without pushing it off-center. */}
          <div className="mb-3.5 flex items-center justify-between">
            <div
              aria-hidden="true"
              className="mx-auto h-1 w-10 rounded-full bg-border"
            />
            <RadixDialog.Close
              aria-label={t('your_compass.detail.close')}
              className="-ml-11 inline-flex min-h-[44px] min-w-[44px] flex-none cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-2xl leading-none text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <span aria-hidden="true">&times;</span>
            </RadixDialog.Close>
          </div>

          {/* Editable name. Transparent until focus, then a clay underline. */}
          <RadixDialog.Title asChild>
            <input
              value={area.name}
              onChange={e => onChange({ name: e.target.value })}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              aria-label={t('your_compass.detail.name_aria')}
              placeholder={t('your_compass.detail.name_placeholder')}
              autoFocus={isNew}
              className="mb-2 box-border w-full border-0 border-b-2 bg-transparent px-0 py-0.5 font-display text-2xl font-semibold text-primary outline-none placeholder:text-text-muted"
              style={{
                borderBottomColor: nameFocus
                  ? 'var(--color-primary)'
                  : 'transparent',
              }}
            />
          </RadixDialog.Title>

          {/* Editable short description -- wraps and grows to fit long prompts. */}
          <textarea
            ref={descRef}
            value={area.description}
            onChange={e => onChange({ description: e.target.value })}
            onInput={autosizeDescription}
            rows={1}
            aria-label={t('your_compass.detail.prompt_aria')}
            placeholder={t('your_compass.detail.prompt_placeholder')}
            className="box-border w-full resize-none overflow-hidden border-none bg-transparent px-0 pt-0 pb-[18px] font-body text-base leading-normal text-text-muted outline-none placeholder:text-text-muted"
          />

          {/* What you value here. */}
          <p className="mb-1 font-body text-base font-semibold text-text">
            {t('your_compass.detail.value_label')}
          </p>
          <p className="mb-3 font-body text-sm text-text-muted">
            {t('your_compass.detail.value_help')}
          </p>
          <Textarea
            rows={3}
            value={area.details}
            onChange={e => onChange({ details: e.target.value })}
            placeholder={t('your_compass.detail.value_placeholder')}
          />

          {/* How much does this matter (clay). */}
          <p className="mt-6 mb-1 font-body text-base font-semibold text-text">
            {t('your_compass.detail.matters_label')}
          </p>
          <p className="mb-3 font-body text-sm text-text-muted">
            {t('your_compass.detail.matters_help')}
          </p>
          <ScaleChooser
            labels={mattersLabels}
            value={mattersValue}
            onChange={n => onChange({ importance: fromBucket(n) })}
            accent="clay"
          />

          {/* How close did you live to it (sage). */}
          <p className="mt-6 mb-1 font-body text-base font-semibold text-text">
            {t('your_compass.detail.lived_label')}
          </p>
          <p className="mb-3 font-body text-sm text-text-muted">
            {t('your_compass.detail.lived_help')}
          </p>
          <ScaleChooser
            labels={livedLabels}
            value={livedValue}
            onChange={n => onChange({ satisfaction: fromBucket(n) })}
            accent="sage"
          />

          {/* Derived reflection. */}
          <div className="mt-6 rounded-md bg-surface-sunken px-4 py-3.5 font-body text-sm leading-normal text-text">
            {t(`your_compass.reflection.${reflectionKey(area)}`)}
          </div>

          {/* Footer: remove (ghost) + done (primary). Goals sits quietly
              between them when an opener is provided. */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(area.id)}
              className="px-2 underline underline-offset-[3px]"
            >
              {t('your_compass.detail.remove')}
            </Button>
            <div className="flex items-center gap-2">
              {onOpenGoals && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenGoals}
                  className="px-2 underline underline-offset-[3px]"
                >
                  {t('your_compass.detail.goals')}
                </Button>
              )}
              <Button variant="primary" onClick={onClose}>
                {t('your_compass.detail.done')}
              </Button>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default AreaDetail;
