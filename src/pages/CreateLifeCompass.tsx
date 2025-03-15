import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, transitions } from '../designTokens';
import LifeAreaCard, { LifeArea } from '../components/LifeAreaCard';
import WarningModal from '../components/WarningModal';
import { getPredefinedLifeAreas } from '../utils/lifeAreaService';
import { useTheme } from '../context/ThemeContext';

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

  // Initialize lifeAreas from local storage if available, otherwise as empty array.
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

  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editImportance, setEditImportance] = useState<number>(5);
  const [editSatisfaction, setEditSatisfaction] = useState<number>(5);
  
  const [pendingEdit, setPendingEdit] = useState<LifeArea | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // New state variables for deletion confirmation
  const [deleteCandidate, setDeleteCandidate] = useState<LifeArea | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Define a universal button style based on theme.
  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme === 'light' ? colors.primary : colors.accent,
    color: '#fff',
    padding: spacing.small,
    border: 'none',
    borderRadius: borderRadius.small,
    cursor: 'pointer',
    transition: `background-color ${transitions.fast}`,
    marginBottom: spacing.medium,
    marginRight: spacing.medium,
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
    // Insert the new area at the beginning so it appears at the top left of the grid.
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

  // Old removal function is replaced by request deletion confirmation
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

  // New deletion confirmation handlers
  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      setLifeAreas(prevLifeAreas => prevLifeAreas.filter(area => area.id !== deleteCandidate.id));
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

  const themedCardStyle: React.CSSProperties = {
    border: `1px solid ${theme === 'light' ? colors.neutral[300] : colors.neutral[700]}`,
    padding: spacing.medium,
    borderRadius: borderRadius.small,
    width: '100%',
    backgroundColor:
      theme === 'light' ? colors.light.background : colors.dark.background,
  };

  // Drag and Drop handlers
  const handleDragStart =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      setDraggedIndex(index);
      event.dataTransfer.effectAllowed = 'move';
    };

  const handleDragOver =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

  const handleDrop =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;
      const reordered = [...lifeAreas];
      const draggedItem = reordered.splice(draggedIndex, 1)[0];
      reordered.splice(index, 0, draggedItem);
      setLifeAreas(reordered);
      setDraggedIndex(null);
    };

  return (
    <div style={{ padding: spacing.medium }}>
      <h2>Skapa Livskompass</h2>
      <p style={{ marginBottom: spacing.medium }}>
        Klicka på "Lägg till livsområde" för att skapa ett nytt livsområde eller
        tryck på knappen nedan för att lägga till de fördefinierade områdena.
      </p>
      {!storageAvailable && (
        <div
          style={{
            backgroundColor: colors.accent,
            color: '#fff',
            padding: spacing.small,
            marginBottom: spacing.medium,
            borderRadius: borderRadius.small,
          }}
        >
          Varning: Local Storage är inte tillgängligt. Dina data sparas inte.
        </div>
      )}
      <button onClick={handleAddNewLifeArea} style={buttonStyle}>
        Lägg till livsområde
      </button>
      <button onClick={handleAddPredefinedAreas} style={buttonStyle}>
        Lägg till fördefinierade områden
      </button>
      {error && (
        <div style={{ color: colors.accent, marginBottom: spacing.medium }}>
          {error}
        </div>
      )}
      <hr style={{ margin: `${spacing.medium} 0` }} />
      {lifeAreas.length === 0 ? (
        <p>Inga livsområden tillagda än.</p>
      ) : isDesktop ? (
        <div className="mx-auto mt-4 grid max-w-[1080px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {lifeAreas.map((area, index) => (
            <div
              key={area.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
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
                style={themedCardStyle}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {lifeAreas.map((area, index) => (
            <div
              key={area.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
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
                style={themedCardStyle}
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
    </div>
  );
};

export default CreateLifeCompass;
