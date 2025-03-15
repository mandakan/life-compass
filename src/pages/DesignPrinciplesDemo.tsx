import React, { useState } from 'react';
import {
  colors,
  typography,
  interactiveStates,
  transitions,
  callouts,
  tooltip,
  inputs,
  spacing,
  borderRadius,
} from '../designTokens';
import { useTheme } from '../context/ThemeContext';
import CustomSlider from '../components/CustomSlider';
import RadarChart from '../components/RadarChart';

function DesignPrinciplesDemo() {
  const [cardHovered, setCardHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const [dropdownValue, setDropdownValue] = useState('option1');
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const { theme: themeMode, toggleTheme } = useTheme();
  const currentTheme = themeMode === 'light' ? colors.light : colors.dark;

  const containerStyle: React.CSSProperties = {
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    minHeight: '100vh',
    fontFamily: typography.primaryFont,
    transition: `background-color ${transitions.medium}, color ${transitions.medium}`,
    padding: spacing.large,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    padding: spacing.medium,
    borderRadius: borderRadius.medium,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${themeMode === 'dark' ? colors.neutral[700] : colors.neutral[300]}`,
    transition: `all ${transitions.medium}`,
    cursor: 'pointer',
    margin: spacing.medium,
    textAlign: 'center',
  };

  const cardHoverStyle: React.CSSProperties = {
    filter: `brightness(${interactiveStates.hover.brightness})`,
    boxShadow: interactiveStates.hover.shadow,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    border: 'none',
    color: '#fff',
    padding: `${spacing.small} ${spacing.medium}`,
    borderRadius: borderRadius.small,
    transition: `all ${transitions.fast}`,
    cursor: 'pointer',
    margin: spacing.small,
  };

  const inputStyle: React.CSSProperties = {
    padding: spacing.small,
    borderRadius: borderRadius.small,
    border: `1px solid ${themeMode === 'dark' ? colors.neutral[600] : colors.neutral[300]}`,
    fontFamily: typography.primaryFont,
    margin: spacing.small,
    width: '100%',
    maxWidth: '300px',
    color: themeMode === 'dark' ? inputs.textDark : inputs.textLight,
  };

  const sliderStyle: React.CSSProperties = {
    width: '300px',
    margin: spacing.small,
  };

  const calloutStyle: React.CSSProperties = {
    borderLeft: `4px solid ${callouts.callout.border}`,
    backgroundColor:
      themeMode === 'dark'
        ? callouts.callout.backgroundDark
        : callouts.callout.backgroundLight,
    padding: spacing.medium,
    margin: `${spacing.medium} 0`,
  };

  const warningStyle: React.CSSProperties = {
    borderLeft: `4px solid ${callouts.warning.border}`,
    backgroundColor:
      themeMode === 'dark'
        ? callouts.warning.backgroundDark
        : callouts.warning.backgroundLight,
    padding: spacing.medium,
    margin: `${spacing.medium} 0`,
  };

  const hoverInfoStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderBottom: '1px dotted gray',
  };

  const tooltipStyle: React.CSSProperties = {
    visibility: 'hidden',
    width: tooltip.width,
    backgroundColor: tooltip.background,
    color: tooltip.color,
    textAlign: 'center',
    borderRadius: tooltip.borderRadius,
    padding: tooltip.padding,
    position: 'absolute',
    zIndex: 1,
    bottom: '125%',
    left: '50%',
    marginLeft: `-${parseInt(tooltip.width) / 2}px`,
    opacity: 0,
    transition: `opacity ${transitions.fast}`,
  };

  const tooltipVisibleStyle: React.CSSProperties = {
    visibility: 'visible',
    opacity: 1,
  };

  // Progress Bar Styles
  const progressContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor:
      themeMode === 'dark' ? colors.neutral[700] : colors.neutral[300],
    borderRadius: borderRadius.small,
    overflow: 'hidden',
    margin: `${spacing.medium} auto`,
  };

  const progressBarStyle: React.CSSProperties = {
    width: `70%`,
    height: '1rem',
    backgroundColor: colors.primary,
    transition: `width ${transitions.medium}`,
  };

  // Spinner Styles
  const spinnerStyle: React.CSSProperties = {
    border: `4px solid ${themeMode === 'dark' ? colors.neutral[600] : colors.neutral[300]}`,
    borderTop: `4px solid ${colors.accent}`,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: `${spacing.medium} auto`,
  };

  // Dragging Handle Style
  const draggingHandleStyle: React.CSSProperties = {
    width: '80px',
    height: '20px',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.small,
    textAlign: 'center',
    lineHeight: '20px',
    cursor: 'grab',
    margin: `${spacing.medium} auto`,
  };

  // Dropdown Style
  const dropdownStyle: React.CSSProperties = {
    padding: spacing.small,
    borderRadius: borderRadius.small,
    border: `1px solid ${themeMode === 'dark' ? colors.neutral[600] : colors.neutral[300]}`,
    fontFamily: typography.primaryFont,
    margin: spacing.small,
    width: '100%',
    maxWidth: '200px',
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
  };

  // Checkbox Style
  const checkboxStyle: React.CSSProperties = {
    margin: spacing.small,
  };

  // Radar Chart demo data
  const radarData = [
    { area: 'Arbete', importance: 8, satisfaction: 6, description: 'Fokusera på projektdeadlines och möten.' },
    { area: 'Hälsa', importance: 9, satisfaction: 7, description: 'Regelbunden träning och balanserad kost.' },
    { area: 'Familj', importance: 7, satisfaction: 8, description: 'Familjetid och sammankomster.' },
    { area: 'Ekonomi', importance: 6, satisfaction: 5, description: 'Budgetering och sparande.' },
    { area: 'Fritid', importance: 5, satisfaction: 4, description: 'Avkoppling och hobbies på fritiden.' },
  ];

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1 style={{ textAlign: 'center', marginBottom: spacing.medium }}>
        Designprinciper Demo
      </h1>
      <div style={{ textAlign: 'center', marginBottom: spacing.large }}>
        <button
          style={buttonStyle}
          onClick={toggleTheme}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onFocus={e => {
            (e.currentTarget as HTMLButtonElement).style.outline =
              interactiveStates.focus.outline;
            (e.currentTarget as HTMLButtonElement).style.outlineOffset =
              interactiveStates.focus.outlineOffset;
          }}
          onBlur={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = 'none';
          }}
        >
          Växla till {themeMode === 'light' ? 'mörkt' : 'ljust'} läge
        </button>
      </div>
      {/* Card Example */}
      <div
        style={{ ...cardStyle, ...(cardHovered ? cardHoverStyle : {}) }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <h2>Kortkomponent</h2>
        <p>
          Detta kort demonstrerar användningen av design tokens för typografi, färger, interaktiva tillstånd och övergångar.
        </p>
      </div>
      {/* Button Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <button
          style={buttonStyle}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.filter =
              `brightness(${interactiveStates.hover.brightness})`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'none';
          }}
          onFocus={e => {
            (e.currentTarget as HTMLButtonElement).style.outline =
              interactiveStates.focus.outline;
            (e.currentTarget as HTMLButtonElement).style.outlineOffset =
              interactiveStates.focus.outlineOffset;
          }}
          onBlur={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = 'none';
          }}
        >
          Exempelkknapp
        </button>
      </div>
      {/* Input Field Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <input type="text" placeholder="Exempel på inmatning" style={inputStyle} />
      </div>
      {/* Callout Example */}
      <div style={calloutStyle}>
        <h3>Notis</h3>
        <p>
          Detta är en informationsruta avsedd att uppmärksamma viktiga detaljer.
        </p>
      </div>
      {/* Warning Example */}
      <div style={warningStyle}>
        <h3>Varning</h3>
        <p>
          Detta är ett varningsmeddelande för att uppmana försiktighet vid en specifik åtgärd.
        </p>
      </div>
      {/* Hover Information Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <p>
          Hovra över denna{' '}
          <span
            style={hoverInfoStyle}
            onMouseEnter={() => setHoverActive(true)}
            onMouseLeave={() => setHoverActive(false)}
          >
            text
            <span
              style={{
                ...tooltipStyle,
                ...(hoverActive ? tooltipVisibleStyle : {}),
              }}
            >
              Detta är ytterligare information vid hovring.
            </span>
          </span>{' '}
          för att se mer information.
        </p>
      </div>
      {/* Progress Bar Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Framstegsindikator</h3>
        <div style={progressContainerStyle}>
          <div style={progressBarStyle}></div>
        </div>
      </div>
      {/* Spinner Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Laddningssymbol</h3>
        <div style={spinnerStyle}></div>
      </div>
      {/* Dropdown Menu Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Rullgardinsmeny</h3>
        <select
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          style={dropdownStyle}
        >
          <option value="option1">Alternativ 1</option>
          <option value="option2">Alternativ 2</option>
          <option value="option3">Alternativ 3</option>
        </select>
      </div>
      {/* Checkbox Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Kryssruta</h3>
        <label>
          <input
            type="checkbox"
            checked={checkboxChecked}
            onChange={e => setCheckboxChecked(e.target.checked)}
            style={checkboxStyle}
          />{' '}
          Markera mig!
        </label>
      </div>
      {/* Custom Slider Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Anpassat reglage-exempel</h3>
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
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Standardreglage-exempel</h3>
        <input
          type="range"
          value={sliderValue}
          min={1}
          max={10}
          step={1}
          onChange={e => setSliderValue(Number(e.target.value))}
          style={sliderStyle}
        />
        <p>Reglagevärde: {sliderValue}</p>
      </div>
      {/* Dragging Handle Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Dra mig</h3>
        <div
          draggable
          style={draggingHandleStyle}
          onDragStart={e => {
            e.dataTransfer.setData('text/plain', 'DraggingHandle');
          }}
        >
          Dra mig
        </div>
      </div>
      {/* Typography Examples */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Exempel på typografi</h3>
        <h1
          style={{
            fontFamily: typography.primaryFont,
            fontSize: '2.5rem',
            margin: spacing.small,
          }}
        >
          H1 - Rubrik
        </h1>
        <h2
          style={{
            fontFamily: typography.primaryFont,
            fontSize: '2rem',
            margin: spacing.small,
          }}
        >
          H2 - Underrubrik
        </h2>
        <h3
          style={{
            fontFamily: typography.primaryFont,
            fontSize: '1.5rem',
            margin: spacing.small,
          }}
        >
          H3 - Avsnittsrubrik
        </h3>
        <p
          style={{
            fontFamily: typography.fallbackFont,
            fontSize: '1rem',
            margin: spacing.small,
          }}
        >
          Exempel på brödtext: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <p
          style={{
            fontFamily: typography.fallbackFont,
            fontSize: '0.8rem',
            margin: spacing.small,
          }}
        >
          Exempel på bildtext: Detta är en bildtext.
        </p>
      </div>
      {/* Radar Chart Demo */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Exempel på Livskompass Radar Diagram</h3>
        <RadarChart data={radarData} width="90%" aspect={1} />
      </div>
    </div>
  );
}

export default DesignPrinciplesDemo;
