import React, { useState, useEffect } from 'react';
import OnboardingTutorialWrapper from '@components/OnboardingTutorialWrapper';
import LifeAreaCard from '@components/LifeAreaCard';
import { LifeArea } from '@models/LifeArea';
import WarningDialog from '@components/ui/WarningDialog';
import Callout from '../components/Callout';
import { getPredefinedLifeAreas } from '@utils/lifeAreaService';
import { useTheme } from '@context/ThemeContext';
import RadarChart from '@components/RadarChart';
import FloatingToolbar from '@components/FloatingToolbar';
import { parseAndValidateJSON } from '@utils/importService';
import ImportPreviewModal from '@components/ImportPreviewModal';
import SuccessModal from '@components/SuccessModal';
import { useTranslation } from 'react-i18next';
import { ImportedData } from 'types/importExport';

const LOCAL_STORAGE_KEY = 'lifeCompass';

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
  const { theme } = useTheme();
  const [storageAvailable] = useState<boolean>(() => isLocalStorageAvailable());

  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>(() => {
    if (storageAvailable) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error('Failed to parse saved life areas', err);
      }
    }
    return [];
  });

  const [error, setError] = useState('');
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRecommendationCallout, setShowRecommendationCallout] =
    useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editImportance, setEditImportance] = useState<number>(5);
  const [editSatisfaction, setEditSatisfaction] = useState<number>(5);

  const [pendingEdit, setPendingEdit] = useState<LifeArea | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const [deleteCandidate, setDeleteCandidate] = useState<LifeArea | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Track newly created card ID so we know to remove it if editing is aborted.
  const [newAreaId, setNewAreaId] = useState<string | null>(null);

  // New state to track if a footer is visible on the page.
  const [footerVisible, setFooterVisible] = useState(false);

  // New state to control whether radar view is active.
  const [showRadar, setShowRadar] = useState<boolean>(false);

  // Clear editing state if the edited area is no longer in lifeAreas
  useEffect(() => {
    if (editingAreaId && !lifeAreas.some(area => area.id === editingAreaId)) {
      setEditingAreaId(null);
      setEditName('');
      setEditDescription('');
      setEditDetails('');
      setEditImportance(5);
      setEditSatisfaction(5);
    }
  }, [lifeAreas, editingAreaId]);

  useEffect(() => {
    if (storageAvailable) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lifeAreas));
      } catch (err) {
        console.error('Failed to save life areas', err);
      }
    }
  }, [lifeAreas, storageAvailable]);

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

  // Use IntersectionObserver to detect when a footer element becomes visible
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setFooterVisible(entry.isIntersecting);
        },
        { root: null, threshold: 0 },
      );
      observer.observe(footer);
      return () => observer.disconnect();
    }
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
    if (typeof insertionIndex === 'number') {
      setLifeAreas([
        ...lifeAreas.slice(0, insertionIndex),
        newArea,
        ...lifeAreas.slice(insertionIndex),
      ]);
    } else {
      setLifeAreas([...lifeAreas, newArea]);
    }
    setNewAreaId(newArea.id);
    setEditingAreaId(newArea.id);
    setEditName(newArea.name);
    setEditDescription(newArea.description);
    setEditDetails(newArea.details);
    setEditImportance(newArea.importance);
    setEditSatisfaction(newArea.satisfaction);
  };

  const handleAddPredefinedAreas = async () => {
    const predefined = await getPredefinedLifeAreas();
    const newAreas = predefined.filter(
      predef =>
        !lifeAreas.some(
          existing => existing.name.toLowerCase() === predef.name.toLowerCase(),
        ),
    );
    if (newAreas.length > 0) {
      setLifeAreas([...lifeAreas, ...newAreas]);
    }
  };

  const handleRequestDeleteLifeArea = (id: string) => {
    const candidate = lifeAreas.find(area => area.id === id);
    if (candidate) {
      setDeleteCandidate(candidate);
      setShowDeleteModal(true);
    }
  };

  const handleEditLifeArea = (area: LifeArea) => {
    if (editingAreaId && editingAreaId !== area.id) {
      setPendingEdit(area);
      setShowWarningModal(true);
      return;
    }
    setEditingAreaId(area.id);
    setEditName(area.name);
    setEditDescription(area.description);
    setEditDetails(area.details);
    setEditImportance(area.importance);
    setEditSatisfaction(area.satisfaction);
    setError('');
  };

  const handleModalConfirm = () => {
    if (pendingEdit) {
      setEditingAreaId(pendingEdit.id);
      setEditName(pendingEdit.name);
      setEditDescription(pendingEdit.description);
      setEditDetails(pendingEdit.details);
      setEditImportance(pendingEdit.importance);
      setEditSatisfaction(pendingEdit.satisfaction);
    }
    setPendingEdit(null);
    setShowWarningModal(false);
    setError('');
  };

  const handleModalCancel = () => {
    setPendingEdit(null);
    setShowWarningModal(false);
  };

  const handleSaveEditLifeArea = () => {
    if (editName.trim() === '') {
      setError(t('name_is_required'));
      return;
    }
    if (
      lifeAreas.find(
        area =>
          area.name.toLowerCase() === editName.trim().toLowerCase() &&
          area.id !== editingAreaId,
      )
    ) {
      setError(t('duplicate_name_not_allowed'));
      return;
    }
    setError('');
    setLifeAreas(
      lifeAreas.map(area => {
        if (area.id === editingAreaId) {
          return {
            ...area,
            name: editName.trim(),
            description: editDescription.trim(),
            details: editDetails.trim(),
            importance: editImportance,
            satisfaction: editSatisfaction,
          };
        }
        return area;
      }),
    );
    setEditingAreaId(null);
    setEditName('');
    setEditDescription('');
    setEditDetails('');
    setEditImportance(5);
    setEditSatisfaction(5);
    if (newAreaId === editingAreaId) {
      setNewAreaId(null);
    }
  };

  const handleCancelEdit = () => {
    if (editingAreaId && newAreaId === editingAreaId) {
      setLifeAreas(prevLifeAreas =>
        prevLifeAreas.filter(area => area.id !== editingAreaId),
      );
      setNewAreaId(null);
    }
    setEditingAreaId(null);
    setEditName('');
    setEditDescription('');
    setEditDetails('');
    setEditImportance(5);
    setEditSatisfaction(5);
    setError('');
  };

  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      setLifeAreas(prevLifeAreas =>
        prevLifeAreas.filter(area => area.id !== deleteCandidate.id),
      );
      if (editingAreaId === deleteCandidate.id) {
        handleCancelEdit();
      }
    }
    setDeleteCandidate(null);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setDeleteCandidate(null);
    setShowDeleteModal(false);
  };

  const handleRemoveAllLifeAreas = () => {
    setShowRemoveAllModal(true);
  };

  const handleRemoveAllConfirm = () => {
    setLifeAreas([]);
    setShowRemoveAllModal(false);
  };

  const handleRemoveAllCancel = () => {
    setShowRemoveAllModal(false);
  };

  const handleAutoUpdateRating = (
    field: 'importance' | 'satisfaction',
    newValue: number,
    areaToUpdate: LifeArea,
  ) => {
    setLifeAreas(prevLifeAreas =>
      prevLifeAreas.map(area => {
        if (area.id === areaToUpdate.id) {
          return { ...area, [field]: newValue };
        }
        return area;
      }),
    );
  };

  const handleInlineDetailsChange = (
    newDetails: string,
    areaToUpdate: LifeArea,
  ) => {
    setLifeAreas(prevLifeAreas =>
      prevLifeAreas.map(area => {
        if (area.id === areaToUpdate.id) {
          return { ...area, details: newDetails };
        }
        return area;
      }),
    );
  };

  const handleDragStart =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      const cardEl = event.currentTarget;
      if (cardEl && event.dataTransfer) {
        event.dataTransfer.setDragImage(
          cardEl,
          cardEl.clientWidth / 2,
          cardEl.clientHeight / 2,
        );
        event.dataTransfer.setData('text/plain', index.toString());
        event.dataTransfer.effectAllowed = 'move';
      }
      setDraggedIndex(index);
    };

  const handleDragOver =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
      setDragOverIndex(index);
    };

  const handleDrop =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      let draggedIdx: number | null = null;
      if (event.dataTransfer) {
        const data = event.dataTransfer.getData('text/plain');
        const parsedIndex = parseInt(data, 10);
        if (!isNaN(parsedIndex)) {
          draggedIdx = parsedIndex;
        } else {
          draggedIdx = draggedIndex;
        }
      } else {
        draggedIdx = draggedIndex;
      }
      if (draggedIdx !== null && draggedIdx !== index) {
        const reordered = [...lifeAreas];
        const draggedItem = reordered.splice(draggedIdx, 1)[0];
        reordered.splice(index, 0, draggedItem);
        setLifeAreas(reordered);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

  const radarData = lifeAreas.map(area => ({
    area: area.name,
    importance: area.importance,
    satisfaction: area.satisfaction,
    description: area.details,
  }));

  const handleImportFile = (fileContent: string) => {
    const result = parseAndValidateJSON(fileContent);
    if (!result.valid) {
      if (result.errors) {
        alert(t('import_error') + result.errors.join(', '));
      }
      return;
    }
    setImportedData(result.data);
    setPreviewVisible(true);
  };

  const handleConfirmImport = () => {
    if (importedData && importedData.data) {
      setLifeAreas(importedData.data.lifeAreas);
      setPreviewVisible(false);
      setImportedData(null);
      setShowSuccessModal(true);
    }
  };

  const handleCancelImport = () => {
    setPreviewVisible(false);
    setImportedData(null);
  };

  return (
    <div className="create-life-compass-page bg-bg text-text p-4">
      <OnboardingTutorialWrapper
        onPredefinedSelected={handleAddPredefinedAreas}
      />
      {!storageAvailable && (
        <div className="mb-4 rounded-sm bg-[var(--color-accent)] p-2 font-sans text-[var(--on-accent)]">
          {t('local_storage_not_available')}
        </div>
      )}
      {lifeAreas.length > 10 && showRecommendationCallout && (
        <Callout onDismiss={() => setShowRecommendationCallout(false)} />
      )}
      <FloatingToolbar
        onAddPredefinedAreas={handleAddPredefinedAreas}
        onToggleRadar={() => setShowRadar(prev => !prev)}
        showRadar={showRadar}
        onImportFile={handleImportFile}
        onRemoveAll={handleRemoveAllLifeAreas}
        footerVisible={footerVisible}
      />
      {error && (
        <div className="mb-4 font-sans text-[var(--color-accent)]">{error}</div>
      )}
      {showRadar ? (
        <div className="mx-auto mt-4 w-full">
          <RadarChart data={radarData} width="100%" aspect={1} />
        </div>
      ) : isDesktop ? (
        <div className="mx-auto mt-4 grid max-w-[1080px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {lifeAreas.map((area, index) => (
            <div
              key={area.id}
              onDragOver={handleDragOver(index)}
              onDragEnter={() => setDragOverIndex(index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={handleDrop(index)}
              className={`flex h-full w-full ${
                dragOverIndex === index
                  ? 'border-2 border-dashed border-[var(--color-primary)]'
                  : ''
              }`}
            >
              <LifeAreaCard
                area={area}
                isEditing={editingAreaId === area.id}
                editName={editName}
                editDescription={editDescription}
                editDetails={editDetails}
                editImportance={editImportance}
                editSatisfaction={editSatisfaction}
                onChangeEditName={setEditName}
                onChangeEditDescription={setEditDescription}
                onChangeEditDetails={setEditDetails}
                onChangeEditImportance={setEditImportance}
                onChangeEditSatisfaction={setEditSatisfaction}
                onSaveEdit={handleSaveEditLifeArea}
                onCancelEdit={handleCancelEdit}
                onEdit={handleEditLifeArea}
                onRemove={handleRequestDeleteLifeArea}
                existingNames={lifeAreas.map(a => a.name)}
                className="w-full rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 font-sans"
                onAutoUpdateRating={handleAutoUpdateRating}
                dragHandle={{
                  draggable: editingAreaId === area.id ? false : true,
                  onDragStart: handleDragStart(index),
                }}
                onInlineDetailsChange={handleInlineDetailsChange}
              />
            </div>
          ))}
          <div
            onClick={() => handleAddNewLifeArea(lifeAreas.length)}
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-[var(--color-primary)] p-4"
          >
            <span className="text-[var(--color-primary)]">
              {t('plus_add_new_life_area')}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {lifeAreas.map((area, index) => (
            <div
              key={area.id}
              onDragOver={handleDragOver(index)}
              onDragEnter={() => setDragOverIndex(index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={handleDrop(index)}
              className={`flex h-full w-full ${
                dragOverIndex === index
                  ? 'border-2 border-dashed border-[var(--color-primary)]'
                  : ''
              }`}
            >
              <LifeAreaCard
                area={area}
                isEditing={editingAreaId === area.id}
                editName={editName}
                editDescription={editDescription}
                editDetails={editDetails}
                editImportance={editImportance}
                editSatisfaction={editSatisfaction}
                onChangeEditName={setEditName}
                onChangeEditDescription={setEditDescription}
                onChangeEditDetails={setEditDetails}
                onChangeEditImportance={setEditImportance}
                onChangeEditSatisfaction={setEditSatisfaction}
                onSaveEdit={handleSaveEditLifeArea}
                onCancelEdit={handleCancelEdit}
                onEdit={handleEditLifeArea}
                onRemove={handleRequestDeleteLifeArea}
                existingNames={lifeAreas.map(a => a.name)}
                className="w-full rounded-sm border border-[var(--border)] bg-[var(--color-bg)] p-4 font-sans"
                onAutoUpdateRating={handleAutoUpdateRating}
                dragHandle={{
                  draggable: editingAreaId === area.id ? false : true,
                  onDragStart: handleDragStart(index),
                }}
                onInlineDetailsChange={handleInlineDetailsChange}
              />
            </div>
          ))}
          <div
            onClick={() => handleAddNewLifeArea(lifeAreas.length)}
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-[var(--color-primary)] p-4"
          >
            <span className="text-[var(--color-primary)]">
              {t('+ Lägg till nytt livsområde')}
            </span>
          </div>
        </div>
      )}
      <WarningDialog
        visible={showWarningModal}
        message={t('unsaved_changes_warning')}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
      <WarningDialog
        visible={showDeleteModal}
        message={t('remove_life_area_warning')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <WarningDialog
        visible={showRemoveAllModal}
        message={t('remove_all_life_areas_warning')}
        onConfirm={handleRemoveAllConfirm}
        onCancel={handleRemoveAllCancel}
      />
      <ImportPreviewModal
        visible={previewVisible}
        metadata={
          importedData
            ? importedData.metadata
            : { exportTimestamp: '', version: '' }
        }
        data={importedData ? importedData.data : { lifeAreas: [], history: [] }}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />
      <SuccessModal
        visible={showSuccessModal}
        message={t('import_successful')}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default CreateLifeCompass;
