import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Squares2X2Icon,
  ChartPieIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import Button from '@components/ui/Button';
import Popover from '@components/ui/Popover';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import { useConfirmDialog } from './ui/hooks/useConfirmDialog';
import { useLifeCompassStore } from '../store/lifeCompassStore';
import { cn } from '@/lib/utils';

export interface CompassActionBarProps {
  /** Adds a single blank life area (primary action). */
  onAddArea: () => void;
  /** Adds the predefined set of life areas (overflow menu). */
  onAddPredefinedAreas: () => void;
  /** Toggles between the cards and radar views. */
  onToggleRadar: () => void;
  showRadar: boolean;
  /** Receives the raw file content of an imported document. */
  onImportFile: (fileContent: string) => void;
  /** Removes all life areas (overflow menu, danger). */
  onRemoveAll: () => void;
}

/**
 * The compass page action bar. Replaces the old floating FAB popover with a
 * clear hierarchy: a segmented Cards/Radar view toggle, a prominent primary
 * "Add life area" button, and a small overflow "More" menu (Popover) holding
 * the occasional actions (add predefined, save snapshot, export, import,
 * delete all).
 *
 * On desktop it sits inline in the compass page header. On mobile (<~720px) it
 * is rendered as a fixed sticky bottom bar that stays thumb-reachable and
 * respects `env(safe-area-inset-bottom)`.
 */
const CompassActionBar: React.FC<CompassActionBarProps> = ({
  onAddArea,
  onAddPredefinedAreas,
  onToggleRadar,
  showRadar,
  onImportFile,
  onRemoveAll,
}) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Render a single variant so there is exactly one of each control in the DOM
  // (avoids duplicate accessible names). Inline in the header at >=720px;
  // fixed sticky bottom bar below that.
  const [isWide, setIsWide] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 720px)').matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
      return;
    const mql = window.matchMedia('(min-width: 720px)');
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  const saveSnapshot = useLifeCompassStore(state => state.saveSnapshot);

  const { confirm, ConfirmationDialog } = useConfirmDialog();
  const handleImportError = async (error: string) => {
    await confirm({
      type: 'error',
      message: error,
      confirmLabel: t('ok'),
    });
  };

  const handleSaveSnapshot = () => {
    saveSnapshot();
    setMenuOpen(false);
  };

  const handleAddPredefined = () => {
    onAddPredefinedAreas();
    setMenuOpen(false);
  };

  const handleRemoveAll = () => {
    onRemoveAll();
    setMenuOpen(false);
  };

  // Segmented Cards / Radar view toggle.
  const viewToggle = (
    <div
      role="group"
      aria-label={t('cards_radar_view')}
      className="inline-flex shrink-0 rounded-md border border-border bg-surface p-1 shadow-warm-sm"
    >
      <button
        type="button"
        onClick={() => {
          if (showRadar) onToggleRadar();
        }}
        aria-pressed={!showRadar}
        className={cn(
          'inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
          'transition-colors duration-base ease-out-soft',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          !showRadar
            ? 'bg-primary text-on-primary'
            : 'bg-transparent text-text hover:bg-surface-sunken',
        )}
      >
        <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
        {t('view_cards')}
      </button>
      <button
        type="button"
        onClick={() => {
          if (!showRadar) onToggleRadar();
        }}
        aria-pressed={showRadar}
        className={cn(
          'inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
          'transition-colors duration-base ease-out-soft',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          showRadar
            ? 'bg-primary text-on-primary'
            : 'bg-transparent text-text hover:bg-surface-sunken',
        )}
      >
        <ChartPieIcon className="h-5 w-5" aria-hidden="true" />
        {t('view_radar')}
      </button>
    </div>
  );

  const addButton = (
    <Button
      variant="primary"
      onClick={onAddArea}
      className="shrink-0"
    >
      <PlusIcon className="h-5 w-5" aria-hidden="true" />
      {t('add_life_area')}
    </Button>
  );

  const overflowMenu = (
    <Popover
      open={menuOpen}
      onOpenChange={setMenuOpen}
      side="bottom"
      align="end"
      trigger={
        <Button
          variant="secondary"
          aria-label={t('quick_actions')}
          aria-haspopup="dialog"
          className="shrink-0"
        >
          <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">{t('more_actions')}</span>
        </Button>
      }
      contentClassName="!w-64"
    >
      <div className="flex flex-col gap-2">
        <Button variant="secondary" onClick={handleAddPredefined}>
          {t('add_predefined')}
        </Button>
        <Button variant="secondary" onClick={handleSaveSnapshot}>
          {t('save_snapshot')}
        </Button>
        <ExportButton />
        <ImportButton
          onFileSelected={onImportFile}
          onError={handleImportError}
        />
        <Button variant="danger" onClick={handleRemoveAll}>
          {t('delete_all')}
        </Button>
      </div>
    </Popover>
  );

  if (isWide) {
    // Inline action bar in the page header.
    return (
      <>
        <div className="flex flex-wrap items-center gap-3">
          {viewToggle}
          <div className="ml-auto flex items-center gap-3">
            {addButton}
            {overflowMenu}
          </div>
        </div>
        {ConfirmationDialog}
      </>
    );
  }

  // Mobile: fixed sticky bottom bar, thumb-reachable, safe-area aware.
  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 shadow-warm-md backdrop-blur-sm"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2">
          {viewToggle}
          <div className="ml-auto flex items-center gap-2">
            {addButton}
            {overflowMenu}
          </div>
        </div>
      </div>
      {ConfirmationDialog}
    </>
  );
};

export default CompassActionBar;
