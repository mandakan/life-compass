import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { LifeArea } from '@models/LifeArea';
import {
  CURRENT_SCHEMA_VERSION,
  type Goal,
  type Snapshot,
} from '@models/LifeCompassDocument';
import type { ImportedData } from 'types/importExport';
import { useLifeCompassStore } from '../store/lifeCompassStore';
import { getPredefinedLifeAreas } from '@utils/lifeAreaService';
import { parseAndValidateJSON } from '@utils/importService';
import { hasSeenOnboarding } from '@utils/storageService';

import Button from '@components/ui/Button';
import Dialog from '@components/ui/Dialog';
import Popover from '@components/ui/Popover';
import RadarChart from '@components/RadarChart';
import SnapshotHistory from '@components/SnapshotHistory';
import ImportButton from '@components/ImportButton';
import ExportButton from '@components/ExportButton';
import GoalsDialog from '@components/goals/GoalsDialog';

import Suggest from '@components/your-compass/Suggest';
import MapView from '@components/your-compass/MapView';
import ListView from '@components/your-compass/ListView';
import TodayView from '@components/your-compass/TodayView';
import WeekView from '@components/your-compass/WeekView';
import PerspectiveSwitcher from '@components/your-compass/PerspectiveSwitcher';
import AreaDetail from '@components/your-compass/AreaDetail';
import { VIEWS, type ViewId } from '@components/your-compass/views';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

type Phase = 'suggest' | 'app';

// Fresh id for a cloned or brand-new area. crypto.randomUUID with a Date.now
// fallback mirrors the existing CreateLifeCompass behavior.
const freshId = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();

const YourCompass: React.FC = () => {
  const { t } = useTranslation();

  const lifeAreas = useLifeCompassStore(state => state.lifeAreas);
  const history = useLifeCompassStore(state => state.history);
  const addArea = useLifeCompassStore(state => state.addArea);
  const updateArea = useLifeCompassStore(state => state.updateArea);
  const removeArea = useLifeCompassStore(state => state.removeArea);
  const removeAllAreas = useLifeCompassStore(state => state.removeAllAreas);
  const saveSnapshot = useLifeCompassStore(state => state.saveSnapshot);
  const importDocument = useLifeCompassStore(state => state.importDocument);

  const [phase, setPhase] = useState<Phase>(() =>
    lifeAreas.length === 0 ? 'suggest' : 'app',
  );
  const [view, setView] = useState<ViewId>('map');
  const [editingId, setEditingId] = useState<string | null>(null);
  // Track the newly-added area so AreaDetail can autofocus + treat blank names
  // as untitled, mirroring CreateLifeCompass's newAreaId.
  const [newAreaId, setNewAreaId] = useState<string | null>(null);
  const [confirmFresh, setConfirmFresh] = useState(false);

  // Overflow dialogs.
  const [showRadar, setShowRadar] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [importError, setImportError] = useState('');

  // Reconcile editing state with the store: if the edited area disappears
  // (removed elsewhere, import, start-fresh), stop editing it.
  useEffect(() => {
    if (editingId && !lifeAreas.some(area => area.id === editingId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingId(null);
    }
  }, [lifeAreas, editingId]);

  const editingArea = editingId
    ? lifeAreas.find(area => area.id === editingId) ?? null
    : null;

  // ----- first-run flow -----

  const handleBuildOwn = () => {
    setPhase('app');
    setView('map');
  };

  const handleContinueWithChosen = (chosen: LifeArea[]) => {
    chosen.forEach(area => addArea({ ...area, id: freshId() }));
    setPhase('app');
    setView('map');
  };

  // ----- area editing -----

  const handleOpen = (id: string) => setEditingId(id);

  const handleAdd = () => {
    const area: LifeArea = {
      id: freshId(),
      name: '',
      description: '',
      details: '',
      importance: 6,
      satisfaction: 6,
    };
    addArea(area);
    setNewAreaId(area.id);
    setEditingId(area.id);
  };

  const handleAreaChange = (changes: Partial<LifeArea>) => {
    if (editingId) updateArea(editingId, changes);
  };

  const handleAreaRemove = (id: string) => {
    removeArea(id);
    setEditingId(null);
    if (newAreaId === id) setNewAreaId(null);
  };

  const handleAreaClose = () => {
    setEditingId(null);
    if (newAreaId) setNewAreaId(null);
  };

  // ----- start fresh -----

  const handleStartFresh = () => {
    setConfirmFresh(false);
    removeAllAreas();
    setEditingId(null);
    setNewAreaId(null);
    setView('map');
    setPhase('suggest');
  };

  // ----- import -----

  const handleImportFile = (fileContent: string) => {
    setImportError('');
    const result = parseAndValidateJSON(fileContent);
    if (!result.valid) {
      setImportError(t('import_error') + (result.errors?.join(', ') ?? ''));
      return;
    }
    const payload = result.data as ImportedData;
    importDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      lifeAreas: payload.data.lifeAreas as LifeArea[],
      history: payload.data.history as unknown as Snapshot[],
      goals: (payload.data.goals ?? []) as Goal[],
    });
    setShowImportExport(false);
    setPhase('app');
  };

  // Brand-new visitor who hasn't met the gentle welcome yet: send them through
  // the immersive tour first. It marks itself seen on finish/skip and returns
  // here, where an empty store lands on the area picker.
  if (lifeAreas.length === 0 && !hasSeenOnboarding()) {
    return <Navigate to="/welcome" replace />;
  }

  if (phase === 'suggest') {
    return (
      <Suggest
        suggestions={getPredefinedLifeAreas()}
        onContinue={handleContinueWithChosen}
        onOwn={handleBuildOwn}
      />
    );
  }

  // ----- app -----

  const hasAreas = lifeAreas.length > 0;
  const activeView = VIEWS.find(v => v.id === view) ?? VIEWS[0];

  const radarData = lifeAreas.map(area => ({
    area: area.name,
    importance: area.importance,
    satisfaction: area.satisfaction,
    description: area.details,
  }));

  const renderBody = () => {
    if (!hasAreas || view === 'map') {
      return (
        <MapView
          areas={lifeAreas}
          history={history}
          onOpen={handleOpen}
          onAdd={handleAdd}
        />
      );
    }
    if (view === 'list') {
      return <ListView areas={lifeAreas} onOpen={handleOpen} />;
    }
    if (view === 'today') {
      return (
        <TodayView areas={lifeAreas} history={history} onOpen={handleOpen} />
      );
    }
    return <WeekView areas={lifeAreas} history={history} onOpen={handleOpen} />;
  };

  return (
    <div className="bg-bg text-text px-4 pb-16">
      <div className="mx-auto w-full max-w-[640px] pt-8">
        {/* Header: eyebrow + title, with overflow menu and start-fresh. */}
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-body text-sm tracking-[0.02em] text-text-muted">
              {t('your_compass.heading.eyebrow')}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold leading-snug text-text sm:text-3xl">
              {t('your_compass.heading.title')}
            </h1>
          </div>

          <div className="flex flex-none items-center gap-1">
            {/* Start-fresh inline confirm. */}
            {confirmFresh ? (
              <div className="flex items-center gap-1">
                <span className="font-body text-sm text-text-muted">
                  {t('your_compass.start_over_q')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmFresh(false)}
                >
                  {t('your_compass.cancel')}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleStartFresh}>
                  {t('your_compass.yes')}
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmFresh(true)}
              >
                {t('your_compass.start_fresh')}
              </Button>
            )}

            {/* Quiet overflow menu. */}
            <Popover
              side="bottom"
              align="end"
              contentClassName="w-[220px] p-2"
              trigger={
                <button
                  type="button"
                  aria-label={t('your_compass.overflow.menu')}
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent text-text transition-colors duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <EllipsisHorizontalIcon className="h-6 w-6" />
                </button>
              }
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setShowRadar(true)}
                  className="cursor-pointer rounded-md px-3 py-2 text-left font-body text-sm text-text transition-colors duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {t('your_compass.overflow.radar')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className="cursor-pointer rounded-md px-3 py-2 text-left font-body text-sm text-text transition-colors duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {t('your_compass.overflow.history')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportExport(true)}
                  className="cursor-pointer rounded-md px-3 py-2 text-left font-body text-sm text-text transition-colors duration-base ease-out-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {t('your_compass.overflow.import_export')}
                </button>
              </div>
            </Popover>
          </div>
        </header>

        {/* Switcher + subtitle. Hidden while the store is empty. */}
        {hasAreas && (
          <div className="mb-6">
            <PerspectiveSwitcher view={view} onChange={setView} />
            <p className="mt-3 font-body text-sm text-text-muted">
              {t(activeView.subKey)}
            </p>
          </div>
        )}

        {/* Body. */}
        {renderBody()}
      </div>

      {/* Area editor. */}
      {editingArea && (
        <AreaDetail
          area={editingArea}
          isNew={editingId === newAreaId}
          history={history}
          onChange={handleAreaChange}
          onRemove={handleAreaRemove}
          onClose={handleAreaClose}
          onOpenGoals={() => setShowGoals(true)}
        />
      )}

      {/* Goals dialog for the editing area. */}
      {editingArea && (
        <GoalsDialog
          area={editingArea}
          open={showGoals}
          onOpenChange={setShowGoals}
        />
      )}

      {/* Balance wheel. */}
      <Dialog
        open={showRadar}
        onOpenChange={setShowRadar}
        title={t('your_compass.overflow.radar')}
      >
        <RadarChart data={radarData} width="100%" aspect={1} />
      </Dialog>

      {/* Snapshot history. */}
      <Dialog
        open={showHistory}
        onOpenChange={setShowHistory}
        title={t('your_compass.overflow.history')}
      >
        <div className="flex flex-col gap-2">
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => saveSnapshot()}
              disabled={!hasAreas}
            >
              {t('save_snapshot')}
            </Button>
          </div>
          <SnapshotHistory />
        </div>
      </Dialog>

      {/* Import / export. */}
      <Dialog
        open={showImportExport}
        onOpenChange={open => {
          setShowImportExport(open);
          if (!open) setImportError('');
        }}
        title={t('your_compass.overflow.import_export')}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ImportButton
            onFileSelected={handleImportFile}
            onError={setImportError}
          />
          <ExportButton />
        </div>
        {importError && (
          <p className="mt-3 font-body text-sm text-danger">{importError}</p>
        )}
      </Dialog>
    </div>
  );
};

export default YourCompass;
