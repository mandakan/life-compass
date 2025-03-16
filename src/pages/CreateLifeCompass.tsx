import React, { useState, useEffect, useRef } from 'react';
import LifeAreaCard from '../components/LifeAreaCard';
import { LifeArea } from '../types/LifeArea';
import WarningModal from '../components/WarningModal';
import Callout from '../components/Callout';
import { getPredefinedLifeAreas } from '../utils/lifeAreaService';
import { useTheme } from '../context/ThemeContext';
import RadarChart from '../components/RadarChart';
import DesktopToolbar from '../components/DesktopToolbar';
import FloatingToolbar from '../components/FloatingToolbar';
import { parseAndValidateJSON } from '../utils/importService';
import ImportPreviewModal from '../components/ImportPreviewModal';
import SuccessModal from '../components/SuccessModal';

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
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [importedData, setImportedData] = useState<any | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const containerRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

  const handleResetConfirm = () => {
    const predefined = getPredefinedLifeAreas();
    setLifeAreas(predefined);
    setEditingAreaId(null);
    setEditName('');
    setEditDescription('');
    setEditDetails('');
    setEditImportance(5);
    setEditSatisfaction(5);
    setShowResetModal(false);
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
  };

  const handleAddNewLifeArea = () => {
    const defaultName = (() => {
      const base = 'Nytt livsområde';
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
    setLifeAreas([newArea, ...lifeAreas]);
    setEditingAreaId(newArea.id);
    setEditName(newArea.name);
    setEditDescription(newArea.description);
    setEditDetails(newArea.details);
    setEditImportance(newArea.importance);
    setEditSatisfaction(newArea.satisfaction);
  };

  const handleAddPredefinedAreas = () => {
    const predefined = getPredefinedLifeAreas();
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
      setError('Namn är obligatoriskt.');
      return;
    }
    if (
      lifeAreas.find(
        area =>
          area.name.toLowerCase() === editName.trim().toLowerCase() &&
          area.id !== editingAreaId,
      )
    ) {
      setError('Dubblett: Samma namn får inte användas.');
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
  };

  const handleCancelEdit = () => {
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
      const cardEl = containerRefs.current[index];
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
        alert('Fel vid import: ' + result.errors.join(', '));
      }
      return;
    }
    setImportedData(result.data);
    setPreviewVisible(true);
  };

  const handleConfirmImport = () => {
    if (importedData && importedData.data) {
      setLifeAreas(importedData.data.lifeAreas);
      // Optionally update userSettings or history here.
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
    <div
      className={`bg-[var(--color-bg)] p-4 ${isDesktop ? 'pt-[calc(1rem)]' : 'pt-4'} font-sans`}
    >
      {!storageAvailable && (
        <div className="mb-4 rounded-sm bg-[var(--color-accent)] p-2 font-sans text-white">
          Varning: Local Storage är inte tillgängligt. Dina data sparas inte.
        </div>
      )}
      {lifeAreas.length > 10 && showRecommendationCallout && (
        <Callout onDismiss={() => setShowRecommendationCallout(false)} />
      )}
      {isDesktop ? (
        <DesktopToolbar
          onAddNewLifeArea={handleAddNewLifeArea}
          onAddPredefinedAreas={handleAddPredefinedAreas}
          onReset={() => setShowResetModal(true)}
          onToggleRadar={() => setShowRadar(prev => !prev)}
          showRadar={showRadar}
          onImportFile={handleImportFile}
        />
      ) : (
        <FloatingToolbar
          onAddNewLifeArea={handleAddNewLifeArea}
          onAddPredefinedAreas={handleAddPredefinedAreas}
          onReset={() => setShowResetModal(true)}
          onToggleRadar={() => setShowRadar(prev => !prev)}
          showRadar={showRadar}
          onImportFile={handleImportFile}
        />
      )}
      {error && (
        <div className="mb-4 font-sans text-[var(--color-accent)]">{error}</div>
      )}
      {isDesktop && <hr className="my-4" />}
      {showRadar ? (
        <div className="mx-auto mt-4 w-full">
          <RadarChart data={radarData} width="100%" aspect={1} />
        </div>
      ) : isDesktop ? (
        <div className="mx-auto mt-4 grid max-w-[1080px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {lifeAreas.map((area, index) => (
            <div
              key={area.id}
              ref={el => (containerRefs.current[index] = el)}
              onDragOver={handleDragOver(index)}
              onDragEnter={() => setDragOverIndex(index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={handleDrop(index)}
              className={`flex h-full w-full ${dragOverIndex === index ? 'border-2 border-dashed border-[var(--color-primary)]' : ''}`}
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
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {lifeAreas.map((area, index) => (
            <div
              key={area.id}
              ref={el => (containerRefs.current[index] = el)}
              onDragOver={handleDragOver(index)}
              onDragEnter={() => setDragOverIndex(index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={handleDrop(index)}
              className={`flex h-full w-full ${dragOverIndex === index ? 'border-2 border-dashed border-[var(--color-primary)]' : ''}`}
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
        </div>
      )}
      <WarningModal
        visible={showWarningModal}
        message="Du har osparade ändringar. Om du byter kort förloras dina ändringar. Fortsätt?"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
      <WarningModal
        visible={showDeleteModal}
        message="Är du säker på att du vill ta bort detta livsområde?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <WarningModal
        visible={showResetModal}
        message="Är du säker på att du vill återställa livsområden till standard?"
        onConfirm={handleResetConfirm}
        onCancel={handleResetCancel}
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
        message="Import lyckades!"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default CreateLifeCompass;
