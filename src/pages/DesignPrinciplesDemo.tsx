import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Slider from '@/components/ui/Slider';
import RadarChart from '../components/RadarChart';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Callout from '../components/Callout';
import WarningMessage from '../components/WarningMessage';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import Tooltip from '@components/Tooltip';
import Popover from '@components/ui/Popover';
import { useTranslation } from 'react-i18next';

function DesignPrinciplesDemo() {
  const [sliderValue, setSliderValue] = useState(5);
  const [dropdownValue, setDropdownValue] = useState('option1');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const { t } = useTranslation();
  const { theme: themeMode } = useTheme();

  return (
    <div className="bg-bg text-text min-h-screen p-8 font-sans transition-colors duration-300">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1 className="mb-8 text-center">
        {t('design_principles_demo', 'Designprinciper Demo')}
      </h1>

      {/* Language and Theme Switchers */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border-border rounded-md border p-4">
          <h2 className="mb-4 text-xl font-semibold">
            {t('language_settings', 'Språkinställningar')}
          </h2>
          <LanguageSwitcher />
        </div>

        <div className="border-border rounded-md border p-4">
          <h2 className="mb-4 text-xl font-semibold">
            {t('theme_settings', 'Temainställningar')}
          </h2>
          <ThemeSwitcher />
        </div>
      </div>
      {/* Card Example */}
      <div className="bg-bg text-text m-4 cursor-pointer rounded-md border p-4 text-center shadow transition-all duration-300 hover:shadow-lg hover:brightness-95 hover:filter">
        <h2 className="mb-2 text-lg font-semibold">Kortkomponent</h2>
        <p>
          Detta kort demonstrerar användningen av design tokens för typografi,
          färger, interaktiva tillstånd och övergångar.
        </p>
      </div>
      {/* Button Example */}
      <div className="mt-8 text-center">
        <button className="bg-primary text-on-primary focus:ring-focus mx-2 cursor-pointer rounded-sm px-4 py-2 transition-all duration-150 hover:brightness-95 focus:ring focus:outline-none">
          Exempelkknapp
        </button>
      </div>
      {/* Input Field Example */}
      <div className="mt-8 text-center">
        <input
          type="text"
          placeholder="Exempel på inmatning"
          className="border-border bg-bg text-text m-2 w-full max-w-xs rounded border p-2 font-sans"
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
      {/* Tooltip Demo */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Tooltip Example</h3>
        <Tooltip content="Detta är en tooltip!">
          <button className="bg-primary text-on-primary focus:ring-focus mx-2 cursor-pointer rounded-sm px-4 py-2 transition-all duration-150 hover:brightness-95 focus:ring focus:outline-none">
            Hover me for Tooltip
          </button>
        </Tooltip>
      </div>

      {/* Popover Demo */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Popover Example</h3>
        <Popover
          trigger={
            <button className="bg-secondary text-text focus:ring-focus mx-2 cursor-pointer rounded-sm px-4 py-2 transition-all duration-150 hover:brightness-95 focus:ring focus:outline-none">
              Click for Popover
            </button>
          }
          closeButton={true}
        >
          <div className="p-2">
            <h4 className="mb-2 font-semibold">Popover Content</h4>
            <p className="mb-2">Detta är innehåll i en popover-komponent.</p>
            <p>
              Popover använder CSS-variabler för att matcha det aktiva temat.
            </p>
          </div>
        </Popover>
      </div>
      {/* Hover Information Example */}
      <div className="mt-8 text-center">
        <p>
          Hovra över denna{' '}
          <span className="group relative inline-block border-b border-dotted border-gray-500">
            text
            <span className="bg-bg text-text absolute bottom-full left-1/2 mb-2 w-[200px] -translate-x-1/2 transform rounded px-2 py-1 text-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              Detta är ytterligare information vid hovring.
            </span>
          </span>{' '}
          för att se mer information.
        </p>
      </div>
      {/* Progress Bar Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Framstegsindikator</h3>
        <div className="bg-border mx-auto my-4 w-full max-w-md overflow-hidden rounded-sm">
          <div
            className="bg-primary h-4 transition-all duration-300"
            style={{ width: '70%' }}
          ></div>
        </div>
      </div>
      {/* Spinner Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Laddningssymbol</h3>
        <div className="border-border border-t-primary mx-auto my-4 h-10 w-10 animate-spin rounded-full border-4"></div>
      </div>
      {/* Dropdown Menu Example */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Rullgardinsmeny</h3>
        <select
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          className="border-border bg-bg text-text m-2 w-full max-w-xs rounded border p-2 font-sans"
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
          className="bg-secondary mx-auto my-4 h-5 w-20 cursor-grab rounded-sm text-center leading-5"
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
