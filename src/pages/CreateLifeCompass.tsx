import React, { useState } from 'react';

interface LifeArea {
  id: number;
  name: string;
  description: string;
  rating1: number;
  rating2: number;
}

const CreateLifeCompass: React.FC = () => {
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating1, setRating1] = useState<number>(5);
  const [rating2, setRating2] = useState<number>(5);
  const [error, setError] = useState('');

  const handleAddLifeArea = () => {
    if (name.trim() === '') {
      setError('Name is required.');
      return;
    }
    // Validate duplicate name (case insensitive)
    if (lifeAreas.find(area => area.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Duplicate life area name not allowed.');
      return;
    }
    setError('');
    const newArea: LifeArea = {
      id: Date.now(),
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

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Life Compass</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
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
      <hr style={{ margin: '1rem 0' }} />
      <h3>Life Areas</h3>
      {lifeAreas.length === 0 ? (
        <p>No life areas added yet.</p>
      ) : (
        <ul>
          {lifeAreas.map(area => (
            <li key={area.id}>
              <strong>{area.name}</strong>: {area.description} - Ratings: {area.rating1} & {area.rating2}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateLifeCompass;
