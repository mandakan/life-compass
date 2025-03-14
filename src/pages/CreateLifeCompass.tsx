import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius } from '../designTokens';
import LifeAreaCard, { LifeArea } from '../components/LifeAreaCard';
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
  const [compassType, setCompassType] = useState<'custom' | 'predefined'>('custom');
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [importance, setImportance] = useState<number>(5);
  const [satisfaction, setSatisfaction] = useState<number>(5);
  const [error, setError] = useState('');
  // Instead of setting storageAvailable to true by default, compute its value immediately.
  const [storageAvailable] = useState<boolean>(() => isLocalStorageAvailable());
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);

  // Load saved life areas if localStorage is available
  useEffect(() => {
    if (storageAvailable) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setLifeAreas(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to parse saved life areas', err);
      }
    }
  }, [storageAvailable]);

  // Save life areas to localStorage if available
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
    if (compassType === 'predefined') {
      setLifeAreas(getPredefinedLifeAreas());
    } else {
      setLifeAreas([]);
    }
  }, [compassType]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddLifeArea = () => {
    if (name.trim() === '') {
      setError('Namn är obligatoriskt.');
      return;
    }
    if (lifeAreas.find(area => area.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Dubblett: Samma namn får inte användas.');
      return;
    }
    setError('');
    const newArea: LifeArea = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      details: details.trim(),
      importance,
      satisfaction,
    };
    setLifeAreas([...lifeAreas, newArea]);
    setName('');
    setDescription('');
    setDetails('');
    setImportance(5);
    setSatisfaction(5);
  };

  const handleRemoveLifeArea = (id: string) => {
    setLifeAreas(lifeAreas.filter(area => area.id !== id));
    if (editingAreaId === id) {
      handleCancelEdit();
    }
  };

  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editImportance, setEditImportance] = useState<number>(5);
  const [editSatisfaction, setEditSatisfaction] = useState<number>(5);

  const handleEditLifeArea = (area: LifeArea) => {
    setEditingAreaId(area.id);
    setEditName(area.name);
    setEditDescription(area.description);
    setEditDetails(area.details);
    setEditImportance(area.importance);
    setEditSatisfaction(area.satisfaction);
    setError('');
  };

  const handleSaveEditLifeArea = () => {
    if (editName.trim() === '') {
      setError('Namn är obligatoriskt.');
      return;
    }
    if (lifeAreas.find(area => area.name.toLowerCase() === editName.trim().toLowerCase() && area.id !== editingAreaId)) {
      setError('Dubblett: Samma namn får inte användas.');
      return;
    }
    setError('');
    setLifeAreas(lifeAreas.map(area => {
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
    }));
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

  // Themed card style for both mobile and desktop views
  const themedCardStyle: React.CSSProperties = {
    border: `1px solid ${theme === 'light' ? colors.neutral[300] : colors.neutral[700]}`,
    padding: spacing.medium,
    borderRadius: borderRadius.small,
    minWidth: '200px',
    backgroundColor: theme === 'light' ? colors.light.background : colors.dark.background,
  };

  // Container style for mobile view
  const mobileContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.medium,
    justifyContent: 'center',
    marginTop: spacing.medium,
  };

  // Updated desktop container to use a grid layout with a maximum of 4 cards per row
  const desktopContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.medium,
    marginTop: spacing.medium,
    justifyContent: 'center',
    maxWidth: `calc(200px * 4 + ${spacing.medium} * 3)`,
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div style={{ padding: spacing.medium }}>
      <h2>Create Life Compass</h2>
      <p style={{ marginBottom: spacing.medium }}>
        Vänligen välj typ av livsområden: antingen skapa egna (Custom) eller använd förinställda områden.
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
      <div style={{ marginBottom: spacing.medium }}>
        <strong>Välj typ:</strong>
        <label style={{ marginLeft: spacing.medium }}>
          <input
            type="radio"
            name="compassType"
            value="custom"
            checked={compassType === 'custom'}
            onChange={() => setCompassType('custom')}
          />
          Custom
        </label>
        <label style={{ marginLeft: spacing.medium }}>
          <input
            type="radio"
            name="compassType"
            value="predefined"
            checked={compassType === 'predefined'}
            onChange={() => setCompassType('predefined')}
          />
          Predefined (Förinställda)
        </label>
      </div>
      {compassType === 'custom' && (
        <div style={{ marginBottom: spacing.medium }}>
          <div>
            <label>
              Namn:
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                title="Ange ett unikt namn för livsområdet"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Beskrivning:
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                title="Beskriv kort vad detta livsområde handlar om"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Detaljer:
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                title="Ange ytterligare detaljer för livsområdet"
                style={{ marginLeft: spacing.small, verticalAlign: 'top', padding: spacing.small, borderRadius: borderRadius.small, border: `1px solid ${colors.neutral[400]}`, width: '100%', minHeight: '40px' }}
              />
            </label>
          </div>
          <div>
            <label>
              Viktighet (1-10):
              <input
                type="number"
                value={importance}
                onChange={e => setImportance(Number(e.target.value))}
                min="1"
                max="10"
                title="Ange ett värde mellan 1 och 10"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Tillfredsställelse (1-10):
              <input
                type="number"
                value={satisfaction}
                onChange={e => setSatisfaction(Number(e.target.value))}
                min="1"
                max="10"
                title="Ange ett värde mellan 1 och 10"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          {error && (
            <div style={{ color: colors.accent, marginTop: spacing.small }}>{error}</div>
          )}
          <button onClick={handleAddLifeArea} style={{ marginTop: spacing.medium }}>
            Lägg till livsområde
          </button>
        </div>
      )}
      <hr style={{ margin: `${spacing.medium} 0` }} />
      <h3>Livsområden</h3>
      {lifeAreas.length === 0 ? (
        <p>Inga livsområden tillagda än.</p>
      ) : isDesktop ? (
        <div style={desktopContainerStyle}>
          {lifeAreas.map(area => (
            <LifeAreaCard
              key={area.id}
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
              onRemove={handleRemoveLifeArea}
              style={themedCardStyle}
            />
          ))}
        </div>
      ) : (
        <div style={mobileContainerStyle}>
          {lifeAreas.map(area => (
            <LifeAreaCard
              key={area.id}
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
              onRemove={handleRemoveLifeArea}
              style={themedCardStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateLifeCompass;
