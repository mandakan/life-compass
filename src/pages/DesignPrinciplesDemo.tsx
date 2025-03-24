import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Slider from '@/components/ui/Slider';
import RadarChart from '../components/RadarChart';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Callout from '../components/Callout';
import WarningMessage from '../components/WarningMessage';
import LanguageSwitcher from '../components/LanguageSwitcher';

function DesignPrinciplesDemo() {
  const [sliderValue, setSliderValue] = useState(5);
  const [dropdownValue, setDropdownValue] = useState('option1');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const { theme: themeMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-8 font-sans text-[var(--color-text)] transition-colors duration-300">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1 className="mb-8 text-center">Designprinciper Demo</h1>
      <div className="mb-8 text-center">
        <LanguageSwitcher />
      </div>
      <div className="mb-8 text-center">
        <button
          className="mx-2 cursor-pointer rounded-sm bg-[var(--color-primary)] px-4 py-2 text-[var(--on-primary)] transition-all duration-150 focus:ring focus:ring-[var(--focus-ring)] focus:outline-none"
          onClick={toggleTheme}
        >
          Växla till {themeMode === 'light' ? 'mörkt' : 'ljust'} läge
        </button>
      </div>
      {/* Toggle Switch Example */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-xl">Dark Mode Toggle Switch</h2>
        <ToggleSwitch checked={themeMode === 'dark'} onChange={toggleTheme} />
      </div>
      {/* Card Example */}
      <div className="m-4 cursor-pointer rounded-md border bg-[var(--color-bg)] p-4 text-center text-[var(--color-text)] shadow transition-all duration-300 hover:shadow-lg hover:brightness-95 hover:filter">
        <h2 className="mb-2 text-lg font-semibold">Kortkomponent</h2>
        <p>
          Detta kort demonstrerar användningen av design tokens för typografi,
          färger, interaktiva tillstånd och övergångar.
        </p>
      </div>
      {/* Button Example */}
      <div className="mt-8 text-center">
        <button className="mx-2 cursor-pointer rounded-sm bg-[var(--color-primary)] px-4 py-2 text-[var(--on-primary)] transition-all duration-150 hover:brightness-95 focus:ring focus:ring-[var(--focus-ring)] focus:outline-none">
          Exempelkknapp
        </button>
      </div>
      {/* Input Field Example */}
      <div className="mt-8 text-center">
        <input
          type="text"
          placeholder="Exempel på inmatning"
          className="m-2 w-full max-w-xs rounded border border-[var(--border)] bg-[var(--color-bg)] p-2 font-sans text-[var(--color-text)]"
        />
      </div>
      {/* Callout Example */}
      <Callout onDismiss={() => {}}>
        <h3 className="mb-2 text-lg font-semibold">Notis</h3>
        <p>
          Detta är en informationsruta avsedd att uppmärksamma viktiga detaljer.
        </p>
      </Callout>
      {/* Warning Example (Extracted to WarningMessage component) */}
      <WarningMessage />
      {/* Hover Information Example */}
      <div className="mt-8 text-center">
        <p>
          Hovra över denna{' '}
          <span className="group relative inline-block border-b border-dotted border-gray-500">
            text
            <span className="absolute bottom-full left-1/2 mb-2 w-[200px] -translate-x-1/2 transform rounded bg-[var(--color-bg)] px-2 py-1 text-center text-[var(--color-text)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              Detta är ytterligare information vid hovring.
            </span>
          </span>{' '}
          för att se mer information.
        </p>
      </div>
      {/* Progress Bar Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Framstegsindikator</h3>
        <div className="mx-auto my-4 w-full max-w-md overflow-hidden rounded-sm bg-[var(--border)]">
          <div
            className="h-4 bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: '70%' }}
          ></div>
        </div>
      </div>
      {/* Spinner Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Laddningssymbol</h3>
        <div className="mx-auto my-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--color-accent)]"></div>
      </div>
      {/* Dropdown Menu Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Rullgardinsmeny</h3>
        <select
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          className="m-2 w-full max-w-xs rounded border border-[var(--border)] bg-[var(--color-bg)] p-2 font-sans text-[var(--color-text)]"
        >
          <option value="option1">Alternativ 1</option>
          <option value="option2">Alternativ 2</option>
          <option value="option3">Alternativ 3</option>
        </select>
      </div>
      {/* Checkbox Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Kryssruta</h3>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={checkboxChecked}
            onChange={e => setCheckboxChecked(e.target.checked)}
            className="m-2"
          />
          Markera mig!
        </label>
      </div>
      {/* Custom Slider Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Anpassat reglage-exempel</h3>
        <Slider
          value={sliderValue}
          onChange={newValue => setSliderValue(newValue)}
          min={1}
          max={10}
          width="300px"
        />
        <p>Reglagevärde: {sliderValue}</p>
      </div>
      {/* Default Slider Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Standardreglage-exempel</h3>
        <input
          type="range"
          value={sliderValue}
          min={1}
          max={10}
          step={1}
          onChange={e => setSliderValue(Number(e.target.value))}
          className="m-2 w-72"
        />
        <p>Reglagevärde: {sliderValue}</p>
      </div>
      {/* Dragging Handle Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Dra mig</h3>
        <div
          draggable
          className="mx-auto my-4 h-5 w-20 cursor-grab rounded-sm bg-[var(--color-secondary)] text-center leading-5"
          onDragStart={e => {
            e.dataTransfer.setData('text/plain', 'DraggingHandle');
          }}
        >
          Dra mig
        </div>
      </div>
      {/* Typography Examples */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Exempel på typografi</h3>
        <h1 className="m-2 font-sans text-4xl">H1 - Rubrik</h1>
        <h2 className="m-2 font-sans text-3xl">H2 - Underrubrik</h2>
        <h3 className="m-2 font-sans text-2xl">H3 - Avsnittsrubrik</h3>
        <p className="m-2 font-sans text-base">
          Exempel på brödtext: Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </p>
        <p className="m-2 font-sans text-sm">
          Exempel på bildtext: Detta är en bildtext.
        </p>
      </div>
      {/* Radar Chart Demo */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">
          Exempel på Livskompass Radar Diagram
        </h3>
        <RadarChart
          data={[
            {
              area: 'Arbete',
              importance: 8,
              satisfaction: 6,
              description: 'Fokusera på projektdeadlines och möten.',
            },
            {
              area: 'Hälsa',
              importance: 9,
              satisfaction: 7,
              description: 'Regelbunden träning och balanserad kost.',
            },
            {
              area: 'Familj',
              importance: 7,
              satisfaction: 8,
              description: 'Familjetid och sammankomster.',
            },
            {
              area: 'Ekonomi',
              importance: 6,
              satisfaction: 5,
              description: 'Budgetering och sparande.',
            },
            {
              area: 'Fritid',
              importance: 5,
              satisfaction: 4,
              description: 'Avkoppling och hobbies på fritiden.',
            },
          ]}
          width="90%"
          aspect={1}
        />
      </div>
    </div>
  );
}

export default DesignPrinciplesDemo;
