import React, { useState, useEffect } from 'react';
import OnboardingTutorialWrapper from '@components/OnboardingTutorialWrapper';
import { LifeArea } from '@models/LifeArea';
import Callout from '../components/Callout';
import { getPredefinedLifeAreas } from '@utils/lifeAreaService';
import { useTheme } from '@context/ThemeContext';
import RadarChart from '@components/RadarChart';
import CompassActionBar from '@components/CompassActionBar';
import LifeAreaGrid from '@components/LifeAreaGrid';
import Button from '@components/ui/Button';
import { parseAndValidateJSON } from '@utils/importService';
import { useTranslation } from 'react-i18next';
import { ImportedData } from 'types/importExport';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';
import { useSuccessDialog } from '@components/ui/hooks/useSuccessDialog';
import { useLifeCompassStore } from '../store/lifeCompassStore';
import { CURRENT_SCHEMA_VERSION, Goal, Snapshot } from '../types/LifeCompassDocument';
import { useDragReorder } from '../hooks/useDragReorder';
import SnapshotHistory from '@components/SnapshotHistory';

const isLocalStorageAvailable = (): boolean => {
  try {
    if (!window.localStorage) {
      return false;
    }
  } catch (e) {
    return false;
  }
  try {
    const testKey = '__local_storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const CreateLifeCompass: React.FC = () => {
  const { t } = useTranslation();
  const { confirm: confirmDialog, ConfirmationDialog } = useConfirmDialog();
  const { show: showSuccess, SuccessDialog } = useSuccessDialog();
  const { theme } = useTheme();
  const [storageAvailable] = useState<boolean>(() => isLocalStorageAvailable());

  // Life-area data and persistence now live in the store; this page reads the
  // areas and calls actions instead of owning the array and a localStorage
  // useEffect.
  const lifeAreas = useLifeCompassStore(state => state.lifeAreas);
  const addArea = useLifeCompassStore(state => state.addArea);
  const updateArea = useLifeCompassStore(state => state.updateArea);
  const removeArea = useLifeCompassStore(state => state.removeArea);
  const reorderAreas = useLifeCompassStore(state => state.reorderAreas);
  const removeAllAreas = useLifeCompassStore(state => state.removeAllAreas);
  const importDocument = useLifeCompassStore(state => state.importDocument);

  const [error, setError] = useState('');
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const [showRecommendationCallout, setShowRecommendationCallout] =
    useState(true);

  const [importedData, setImportedData] = useState<ImportedData | null>(null);

  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);

  // Track newly created card ID so we know to remove it if editing is aborted.
  const [newAreaId, setNewAreaId] = useState<string | null>(null);

  // New state to control whether radar view is active.
  const [showRadar, setShowRadar] = useState<boolean>(false);

  const { dragOverIndex, handleDragStart, handleDragOver, handleDrop, setDragOverIndex } =
    useDragReorder(reorderAreas);

  // Reconcile local editing state with the store: if the edited area is
  // removed elsewhere (delete, remove-all, import), stop editing it.
  useEffect(() => {
    if (editingAreaId && !lifeAreas.some(area => area.id === editingAreaId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingAreaId(null);
    }
  }, [lifeAreas, editingAreaId]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem(
      'createlifecompassScrollPosition',
    );
    window.scrollTo(
      0,
      savedScrollPosition ? parseInt(savedScrollPosition, 10) : 0,
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem(
        'createlifecompassScrollPosition',
        window.scrollY.toString(),
      );
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddNewLifeArea = (insertionIndex?: number) => {
    const defaultName = (() => {
      const base = t('new_life_area');
      let name = base;
      let counter = 2;
      while (
        lifeAreas.find(area => area.name.toLowerCase() === name.toLowerCase())
      ) {
        name = `${base} ${counter}`;
        counter++;
      }
      return name;
    })();
    const newArea: LifeArea = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: defaultName,
      description: '',
      details: '',
      importance: 5,
      satisfaction: 5,
    };
    // The store appends; an explicit insertion index is no longer honored, but
    // the only caller adds at the end of the list anyway.
    void insertionIndex;
    addArea(newArea);
    setNewAreaId(newArea.id);
    setEditingAreaId(newArea.id);
  };

  const handleAddPredefinedAreas = async () => {
    const predefined = await getPredefinedLifeAreas();
    const newAreas = predefined.filter(
      predef =>
        !lifeAreas.some(
          existing => existing.name.toLowerCase() === predef.name.toLowerCase(),
        ),
    );
    newAreas.forEach(area => addArea(area));
  };

  const handleRequestDeleteLifeArea = async (id: string) => {
    const candidate = lifeAreas.find(area => area.id === id);
    if (!candidate) return;

    const confirmed = await confirmDialog({
      message: t('remove_life_area_warning'),
      type: 'warning',
      title: t('warning'),
    });

    if (!confirmed) return;

    removeArea(candidate.id);

    if (editingAreaId === candidate.id) {
      handleCancelEdit();
    }
  };

  const handleEditLifeArea = async (area: LifeArea) => {
    if (editingAreaId && editingAreaId !== area.id) {
      const confirmed = await confirmDialog({
        message: t('unsaved_changes_warning'),
        type: 'warning',
        title: t('warning'),
      });

      if (!confirmed) return;
    }
    setEditingAreaId(area.id);
    setError('');
  };

  const handleSaveArea = (updatedArea: LifeArea) => {
    if (updatedArea.name.trim() === '') {
      setError(t('name_is_required'));
      return;
    }
    if (
      lifeAreas.find(
        area =>
          area.name.toLowerCase() === updatedArea.name.trim().toLowerCase() &&
          area.id !== updatedArea.id,
      )
    ) {
      setError(t('duplicate_name_not_allowed'));
      return;
    }
    setError('');
    updateArea(updatedArea.id, {
      name: updatedArea.name.trim(),
      description: updatedArea.description.trim(),
      details: updatedArea.details.trim(),
      importance: updatedArea.importance,
      satisfaction: updatedArea.satisfaction,
    });
    setEditingAreaId(null);
    if (newAreaId === updatedArea.id) {
      setNewAreaId(null);
    }
  };

  const handleCancelEdit = () => {
    if (editingAreaId && newAreaId === editingAreaId) {
      removeArea(editingAreaId);
      setNewAreaId(null);
    }
    setEditingAreaId(null);
    setError('');
  };

  const handleRemoveAllLifeAreas = async () => {
    const confirmed = await confirmDialog({
      message: t('remove_all_life_areas_warning'),
      type: 'warning',
      title: t('warning'),
    });

    if (confirmed) {
      removeAllAreas();
    }
  };

  const handleAutoUpdateRating = (
    field: 'importance' | 'satisfaction',
    newValue: number,
    areaToUpdate: LifeArea,
  ) => {
    updateArea(areaToUpdate.id, { [field]: newValue });
  };

  const handleInlineDetailsChange = (
    newDetails: string,
    areaToUpdate: LifeArea,
  ) => {
    updateArea(areaToUpdate.id, { details: newDetails });
  };

  const radarData = lifeAreas.map(area => ({
    area: area.name,
    importance: area.importance,
    satisfaction: area.satisfaction,
    description: area.details,
  }));

  const handleImportFile = async (fileContent: string) => {
    const result = parseAndValidateJSON(fileContent);
    if (!result.valid) {
      if (result.errors) {
        alert(t('import_error') + result.errors.join(', '));
      }
      return;
    }
    // result.data is unknown (parseAndValidateJSON returns ValidationResult);
    // the schema validation above guarantees the shape matches ImportedData.
    const importedPayload = result.data as ImportedData;
    setImportedData(importedPayload);

    const confirmed = await confirmDialog({
      title: t('import_preview'),
      message: (
        <div>
          <p>
            <strong>{t('exported')}:</strong>{' '}
            {importedPayload.metadata.exportTimestamp}
          </p>
          <p>
            <strong>{t('version')}:</strong> {importedPayload.metadata.version}
          </p>
          <p>
            <strong>{t('life_areas_count')}:</strong>{' '}
            {importedPayload.data.lifeAreas.length}
          </p>
          <p>
            <strong>{t('history_count')}:</strong>{' '}
            {importedPayload.data.history.length}
          </p>
          <p>{t('import_data_prompt')}</p>
        </div>
      ),
      confirmLabel: t('import'),
      cancelLabel: t('cancel'),
    });

    if (confirmed) {
      importDocument({
        schemaVersion: CURRENT_SCHEMA_VERSION,
        lifeAreas: importedPayload.data.lifeAreas as LifeArea[],
        history: importedPayload.data.history as unknown as Snapshot[],
        goals: (importedPayload.data.goals ?? []) as Goal[],
      });
      showSuccess(t('import_successful'));
    }
  };

  const hasAreas = lifeAreas.length > 0;

  return (
    // Bottom padding leaves room for the mobile sticky action bar; cleared at
    // the ~720px breakpoint where the action bar moves into the page header.
    <div className="create-life-compass-page bg-bg text-text p-4 pb-28 min-[720px]:pb-4">
      <OnboardingTutorialWrapper
        onPredefinedSelected={handleAddPredefinedAreas}
      />
      {!storageAvailable && (
        <div className="mb-4 rounded-sm bg-warning p-2 font-sans text-text">
          {t('local_storage_not_available')}
        </div>
      )}

      <header className="mx-auto max-w-[1080px]">
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
          {t('your_life_compass')}
        </h1>
        <p className="mt-1 max-w-prose font-sans text-text-muted">
          {t('compass_subline')}
        </p>
      </header>

      {lifeAreas.length > 10 && showRecommendationCallout && (
        <div className="mx-auto mt-4 max-w-[1080px]">
          <Callout onDismiss={() => setShowRecommendationCallout(false)} />
        </div>
      )}

      <div className="mx-auto mt-4 max-w-[1080px]">
        <CompassActionBar
          onAddArea={() => handleAddNewLifeArea()}
          onAddPredefinedAreas={handleAddPredefinedAreas}
          onToggleRadar={() => setShowRadar(prev => !prev)}
          showRadar={showRadar}
          onImportFile={handleImportFile}
          onRemoveAll={handleRemoveAllLifeAreas}
        />
      </div>

      {error && (
        <div className="mx-auto mt-4 max-w-[1080px] font-sans text-warning">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-[1080px]">
        {!hasAreas ? (
          <section
            aria-labelledby="compass-empty-heading"
            className="mt-6 flex flex-col items-center rounded-lg border border-border bg-surface p-8 text-center shadow-warm-sm"
          >
            <h2
              id="compass-empty-heading"
              className="font-display text-2xl font-semibold text-primary"
            >
              {t('empty_state_title')}
            </h2>
            <p className="mt-2 max-w-prose font-sans text-text-muted">
              {t('empty_state_body')}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => handleAddNewLifeArea()}
              >
                {t('add_life_area')}
              </Button>
              <Button variant="secondary" onClick={handleAddPredefinedAreas}>
                {t('use_predefined')}
              </Button>
            </div>
          </section>
        ) : showRadar ? (
          <section
            aria-labelledby="compass-radar-heading"
            className="mt-4 w-full"
          >
            <h2
              id="compass-radar-heading"
              className="font-display text-xl font-semibold text-primary"
            >
              {t('radar_view_heading')}
            </h2>
            <RadarChart data={radarData} width="100%" aspect={1} />
          </section>
        ) : (
          <LifeAreaGrid
            areas={lifeAreas}
            variant={isDesktop ? 'desktop' : 'mobile'}
            editingAreaId={editingAreaId}
            dragOverIndex={dragOverIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={index => setDragOverIndex(index)}
            onDragLeave={() => setDragOverIndex(null)}
            onEditArea={handleEditLifeArea}
            onRemoveArea={handleRequestDeleteLifeArea}
            onSaveArea={handleSaveArea}
            onCancelEdit={handleCancelEdit}
            onAutoUpdateRating={handleAutoUpdateRating}
            onInlineDetailsChange={handleInlineDetailsChange}
            onAddNewArea={handleAddNewLifeArea}
          />
        )}
      </div>

      <div className="mx-auto max-w-[1080px]">
        <SnapshotHistory />
      </div>
      {ConfirmationDialog}
      {SuccessDialog}
    </div>
  );
};

export default CreateLifeCompass;
