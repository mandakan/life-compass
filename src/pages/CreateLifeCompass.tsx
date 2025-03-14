import React, { useState, useEffect } from 'react';

interface LifeArea {
  id: string;
  name: string;
  description: string;
  rating1: number;
  rating2: number;
}

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

const CreateLifeCompass: React.FC = () => {
  const [compassType, setCompassType] = useState<'custom' | 'predefined'>('custom');
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating1, setRating1] = useState<number>(5);
  const [rating2, setRating2] = useState<number>(5);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setLifeAreas(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved life areas', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lifeAreas));
  }, [lifeAreas]);

  useEffect(() => {
    if (compassType === 'predefined') {
      setLifeAreas(predefinedLifeAreas);
    } else {
      setLifeAreas([]);
    }
  }, [compassType]);

  const handleAddLifeArea = () => {
    if (name.trim() === '') {
      setError('Name is required.');
      return;
    }
    if (lifeAreas.find(area => area.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Duplicate life area name not allowed.');
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
  };

  // Styles for card view
  const cardContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem'
  };

  const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '4px',
    minWidth: '200px',
    position: 'relative'
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-1.5rem',
    left: '0',
    backgroundColor: '#333',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem'
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Life Compass</h2>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Välj typ:</strong>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            name="compassType"
            value="custom"
            checked={compassType === 'custom'}
            onChange={() => setCompassType('custom')}
          />
          Custom
        </label>
        <label style={{ marginLeft: '1rem' }}>
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
        <div style={{ marginBottom: '1rem' }}>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                title="Ange ett unikt namn för livsområdet"
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                title="Beskriv kort vad detta livsområde handlar om"
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          <div>
            <label>
              Rating 1 (1-10):
              <input
                type="number"
                value={rating1}
                onChange={e => setRating1(Number(e.target.value))}
                min="1"
                max="10"
                title="Ange ett värde mellan 1 och 10"
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          <div>
            <label>
              Rating 2 (1-10):
              <input
                type="number"
                value={rating2}
                onChange={e => setRating2(Number(e.target.value))}
                min="1"
                max="10"
                title="Ange ett värde mellan 1 och 10"
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
          </div>
          {error && (
            <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>
          )}
          <button onClick={handleAddLifeArea} style={{ marginTop: '1rem' }}>
            Add Life Area
          </button>
        </div>
      )}
      <hr style={{ margin: '1rem 0' }} />
      <h3>Life Areas</h3>
      {lifeAreas.length === 0 ? (
        <p>No life areas added yet.</p>
      ) : (
        <div style={cardContainerStyle}>
          {lifeAreas.map(area => (
            <div key={area.id} style={cardStyle}>
              <div style={tooltipStyle} title="Click to remove" onClick={() => handleRemoveLifeArea(area.id)}>
                ×
              </div>
              <h4>{area.name}</h4>
              <p>{area.description}</p>
              <p>
                Ratings: {area.rating1} & {area.rating2}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateLifeCompass;
