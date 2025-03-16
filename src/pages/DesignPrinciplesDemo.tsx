import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import CustomSlider from '../components/CustomSlider';
import RadarChart from '../components/RadarChart';
import ToggleSwitch from '../components/ToggleSwitch';
import Callout from '../components/Callout';
import WarningMessage from '../components/WarningMessage';

function DesignPrinciplesDemo() {
  const [sliderValue, setSliderValue] = useState(5);
  const [dropdownValue, setDropdownValue] = useState('option1');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const { theme: themeMode, toggleTheme } = useTheme();

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen font-sans transition-colors duration-300 p-8">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1 className="text-center mb-8">Designprinciper Demo</h1>
      <div className="text-center mb-8">
        <button
          className="bg-[var(--primary)] text-[var(--on-primary)] py-2 px-4 rounded-sm transition-all duration-150 cursor-pointer mx-2 focus:outline-none focus:ring focus:ring-[var(--focus-ring)]"
          onClick={toggleTheme}
        >
          Växla till {themeMode === 'light' ? 'mörkt' : 'ljust'} läge
        </button>
      </div>
      {/* Toggle Switch Example */}
      <div className="text-center mb-8">
        <h2 className="text-xl mb-2">Dark Mode Toggle Switch</h2>
        <ToggleSwitch
          checked={themeMode === 'dark'}
          onChange={toggleTheme}
        />
      </div>
      {/* Card Example */}
      <div
        className="bg-[var(--bg)] text-[var(--text)] p-4 rounded-md shadow border transition-all duration-300 cursor-pointer m-4 text-center hover:filter hover:brightness-95 hover:shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-2">Kortkomponent</h2>
        <p>
          Detta kort demonstrerar användningen av design tokens för typografi,
          färger, interaktiva tillstånd och övergångar.
        </p>
      </div>
      {/* Button Example */}
      <div className="text-center mt-8">
        <button
          className="bg-[var(--primary)] text-[var(--on-primary)] py-2 px-4 rounded-sm transition-all duration-150 cursor-pointer mx-2 focus:outline-none focus:ring focus:ring-[var(--focus-ring)] hover:brightness-95"
        >
          Exempelkknapp
        </button>
      </div>
      {/* Input Field Example */}
      <div className="text-center mt-8">
        <input
          type="text"
          placeholder="Exempel på inmatning"
          className="p-2 rounded border border-[var(--border)] font-sans m-2 w-full max-w-xs text-[var(--text)]"
        />
      </div>
      {/* Callout Example */}
      <Callout onDismiss={() => {}}>
        <h3 className="text-lg font-semibold mb-2">Notis</h3>
        <p>
          Detta är en informationsruta avsedd att uppmärksamma viktiga detaljer.
        </p>
      </Callout>
      {/* Warning Example (Extracted to WarningMessage component) */}
      <WarningMessage />
      {/* Hover Information Example */}
      <div className="text-center mt-8">
        <p>
          Hovra över denna{' '}
          <span 
            className="relative inline-block group border-b border-dotted border-gray-500"
          >
            text
            <span
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[200px] bg-[var(--bg)] text-[var(--text)] text-center rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              Detta är ytterligare information vid hovring.
            </span>
          </span>{' '}
          för att se mer information.
        </p>
      </div>
      {/* Progress Bar Example */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Framstegsindikator</h3>
        <div className="w-full max-w-md bg-[var(--border)] rounded-sm overflow-hidden mx-auto my-4">
          <div className="h-4 bg-[var(--primary)] transition-all duration-300" style={{ width: '70%' }}></div>
        </div>
      </div>
      {/* Spinner Example */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Laddningssymbol</h3>
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin mx-auto my-4"></div>
      </div>
      {/* Dropdown Menu Example */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Rullgardinsmeny</h3>
        <select
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          className="p-2 rounded border border-[var(--border)] font-sans m-2 w-full max-w-xs bg-[var(--bg)] text-[var(--text)]"
        >
          <option value="option1">Alternativ 1</option>
          <option value="option2">Alternativ 2</option>
          <option value="option3">Alternativ 3</option>
        </select>
      </div>
      {/* Checkbox Example */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Kryssruta</h3>
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
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Anpassat reglage-exempel</h3>
        <CustomSlider
          value={sliderValue}
          onChange={newValue => setSliderValue(newValue)}
          min={1}
          max={10}
          width="300px"
        />
        <p>Reglagevärde: {sliderValue}</p>
      </div>
      {/* Default Slider Example */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Standardreglage-exempel</h3>
        <input
          type="range"
          value={sliderValue}
          min={1}
          max={10}
          step={1}
          onChange={e => setSliderValue(Number(e.target.value))}
          className="w-72 m-2"
        />
        <p>Reglagevärde: {sliderValue}</p>
      </div>
      {/* Dragging Handle Example */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Dra mig</h3>
        <div
          draggable
          className="w-20 h-5 bg-[var(--secondary)] rounded-sm text-center leading-5 cursor-grab mx-auto my-4"
          onDragStart={e => {
            e.dataTransfer.setData('text/plain', 'DraggingHandle');
          }}
        >
          Dra mig
        </div>
      </div>
      {/* Typography Examples */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Exempel på typografi</h3>
        <h1 className="font-sans text-4xl m-2">H1 - Rubrik</h1>
        <h2 className="font-sans text-3xl m-2">H2 - Underrubrik</h2>
        <h3 className="font-sans text-2xl m-2">H3 - Avsnittsrubrik</h3>
        <p className="font-sans text-base m-2">
          Exempel på brödtext: Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </p>
        <p className="font-sans text-sm m-2">
          Exempel på bildtext: Detta är en bildtext.
        </p>
      </div>
      {/* Radar Chart Demo */}
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold mb-2">Exempel på Livskompass Radar Diagram</h3>
        <RadarChart 
          data={[
            { area: 'Arbete', importance: 8, satisfaction: 6, description: 'Fokusera på projektdeadlines och möten.' },
            { area: 'Hälsa', importance: 9, satisfaction: 7, description: 'Regelbunden träning och balanserad kost.' },
            { area: 'Familj', importance: 7, satisfaction: 8, description: 'Familjetid och sammankomster.' },
            { area: 'Ekonomi', importance: 6, satisfaction: 5, description: 'Budgetering och sparande.' },
            { area: 'Fritid', importance: 5, satisfaction: 4, description: 'Avkoppling och hobbies på fritiden.' }
          ]}
          width="90%"
          aspect={1}
        />
      </div>
    </div>
  );
}

export default DesignPrinciplesDemo;
