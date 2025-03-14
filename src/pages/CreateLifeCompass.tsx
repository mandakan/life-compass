import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius } from '../designTokens';
import LifeAreaCard, { LifeArea } from '../components/LifeAreaCard';

const LOCAL_STORAGE_KEY = 'lifeCompass';

const predefinedLifeAreas: LifeArea[] = [
  {
    id: 'health',
    name: 'Hälsa',
    description: 'Din fysiska och mentala hälsa',
    rating1: 5,
    rating2: 5,
  },
  {
    id: 'career',
    name: 'Karriär',
    description: 'Dina arbetsmässiga mål och framsteg',
    rating1: 5,
    rating2: 5,
  },
  {
    id: 'relationships',
    name: 'Relationer',
    description: 'Dina personliga relationer och sociala liv',
    rating1: 5,
    rating2: 5,
  },
  {
    id: 'personalDevelopment',
    name: 'Personlig utveckling',
    description: 'Din personliga tillväxt och lärande',
    rating1: 5,
    rating2: 5,
  },
  {
    id: 'finance',
    name: 'Ekonomi',
    description: 'Din ekonomiska trygghet och mål',
    rating1: 5,
    rating2: 5,
  },
];

const isLocalStorageAvailable = (): boolean => {
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
  const [compassType, setCompassType] = useState<'custom' | 'predefined'>('custom');
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating1, setRating1] = useState<number>(5);
  const [rating2, setRating2] = useState<number>(5);
  const [error, setError] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);

  // States for editing an existing area
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRating1, setEditRating1] = useState<number>(5);
  const [editRating2, setEditRating2] = useState<number>(5);

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setStorageAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (storageAvailable) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          setLifeAreas(JSON.parse(saved));
        } catch (err) {
          console.error('Failed to parse saved life areas', err);
        }
      }
    }
  }, [storageAvailable]);

  useEffect(() => {
    if (storageAvailable) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lifeAreas));
    }
  }, [lifeAreas, storageAvailable]);

  useEffect(() => {
    if (compassType === 'predefined') {
      setLifeAreas(predefinedLifeAreas);
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
      rating1,
      rating2,
    };
    setLifeAreas([...lifeAreas, newArea]);
    setName('');
    setDescription('');
    setRating1(5);
    setRating2(5);
  };

  const handleRemoveLifeArea = (id: string) => {
    setLifeAreas(lifeAreas.filter(area => area.id !== id));
    if (editingAreaId === id) {
      handleCancelEdit();
    }
  };

  const handleEditLifeArea = (area: LifeArea) => {
    setEditingAreaId(area.id);
    setEditName(area.name);
    setEditDescription(area.description);
    setEditRating1(area.rating1);
    setEditRating2(area.rating2);
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
          rating1: editRating1,
          rating2: editRating2,
        };
      }
      return area;
    }));
    setEditingAreaId(null);
    setEditName('');
    setEditDescription('');
    setEditRating1(5);
    setEditRating2(5);
  };

  const handleCancelEdit = () => {
    setEditingAreaId(null);
    setEditName('');
    setEditDescription('');
    setEditRating1(5);
    setEditRating2(5);
    setError('');
  };

  // Default card style for mobile view
  const mobileCardStyle: React.CSSProperties = {
    border: `1px solid ${colors.neutral[300]}`,
    padding: spacing.medium,
    borderRadius: borderRadius.small,
    minWidth: '200px',
    backgroundColor: colors.light.background,
  };

  // Container style for mobile view
  const mobileContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.medium,
    justifyContent: 'center',
    marginTop: spacing.medium,
  };

  // Updated desktop container to use grid layout without overlap
  const desktopContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.medium,
    marginTop: spacing.medium,
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
              Betyg 1 (1-10):
              <input
                type="number"
                value={rating1}
                onChange={e => setRating1(Number(e.target.value))}
                min="1"
                max="10"
                title="Ange ett värde mellan 1 och 10"
                style={{ marginLeft: spacing.small }}
              />
            </label>
          </div>
          <div>
            <label>
              Betyg 2 (1-10):
              <input
                type="number"
                value={rating2}
                onChange={e => setRating2(Number(e.target.value))}
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
              editRating1={editRating1}
              editRating2={editRating2}
              onChangeEditName={setEditName}
              onChangeEditDescription={setEditDescription}
              onChangeEditRating1={setEditRating1}
              onChangeEditRating2={setEditRating2}
              onSaveEdit={handleSaveEditLifeArea}
              onCancelEdit={handleCancelEdit}
              onEdit={handleEditLifeArea}
              onRemove={handleRemoveLifeArea}
              style={mobileCardStyle}
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
              editRating1={editRating1}
              editRating2={editRating2}
              onChangeEditName={setEditName}
              onChangeEditDescription={setEditDescription}
              onChangeEditRating1={setEditRating1}
              onChangeEditRating2={setEditRating2}
              onSaveEdit={handleSaveEditLifeArea}
              onCancelEdit={handleCancelEdit}
              onEdit={handleEditLifeArea}
              onRemove={handleRemoveLifeArea}
              style={mobileCardStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateLifeCompass;
```^^^^