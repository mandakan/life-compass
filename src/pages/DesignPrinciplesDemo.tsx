import React from 'react';
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

function DesignPrinciplesDemo() {
  const [cardHovered, setCardHovered] = React.useState(false);
  const [buttonHovered, setButtonHovered] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [hoverActive, setHoverActive] = React.useState(false);
  const [progress, setProgress] = React.useState(70);
  const [dropdownValue, setDropdownValue] = React.useState('option1');
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(50);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const theme = darkMode ? colors.dark : colors.light;

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    minHeight: '100vh',
    fontFamily: typography.primaryFont,
    transition: `background-color ${transitions.medium}, color ${transitions.medium}`,
    padding: spacing.large,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    padding: spacing.medium,
    borderRadius: borderRadius.medium,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${darkMode ? colors.neutral[700] : colors.neutral[300]}`,
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
    border: `1px solid ${darkMode ? colors.neutral[600] : colors.neutral[300]}`,
    fontFamily: typography.primaryFont,
    margin: spacing.small,
    width: '100%',
    maxWidth: '300px',
    color: darkMode ? inputs.textDark : inputs.textLight,
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    margin: spacing.small,
  };

  const calloutStyle: React.CSSProperties = {
    borderLeft: `4px solid ${callouts.callout.border}`,
    backgroundColor: darkMode
      ? callouts.callout.backgroundDark
      : callouts.callout.backgroundLight,
    padding: spacing.medium,
    margin: `${spacing.medium} 0`,
  };

  const warningStyle: React.CSSProperties = {
    borderLeft: `4px solid ${callouts.warning.border}`,
    backgroundColor: darkMode
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
    backgroundColor: darkMode ? colors.neutral[700] : colors.neutral[300],
    borderRadius: borderRadius.small,
    overflow: 'hidden',
    margin: `${spacing.medium} auto`,
  };

  const progressBarStyle: React.CSSProperties = {
    width: `${progress}%`,
    height: '1rem',
    backgroundColor: colors.primary,
    transition: `width ${transitions.medium}`,
  };

  // Spinner Styles
  const spinnerStyle: React.CSSProperties = {
    border: `4px solid ${darkMode ? colors.neutral[600] : colors.neutral[300]}`,
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
    border: `1px solid ${darkMode ? colors.neutral[600] : colors.neutral[300]}`,
    fontFamily: typography.primaryFont,
    margin: spacing.small,
    width: '100%',
    maxWidth: '200px',
    backgroundColor: theme.background,
    color: theme.text,
  };

  // Checkbox Style
  const checkboxStyle: React.CSSProperties = {
    margin: spacing.small,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1 style={{ textAlign: 'center', marginBottom: spacing.medium }}>
        Design Principles Demo
      </h1>
      <div style={{ textAlign: 'center', marginBottom: spacing.large }}>
        <button
          style={buttonStyle}
          onClick={toggleDarkMode}
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
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      {/* Card Example */}
      <div
        style={{ ...cardStyle, ...(cardHovered ? cardHoverStyle : {}) }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <h2>Card Component</h2>
        <p>
          This card demonstrates usage of design tokens for typography, colors,
          interactive states, and transitions.
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
          Example Button
        </button>
      </div>
      {/* Input Field Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <input type="text" placeholder="Sample Input" style={inputStyle} />
      </div>
      {/* Callout Example */}
      <div style={calloutStyle}>
        <h3>Callout</h3>
        <p>
          This is an informational callout intended to draw attention to
          important details.
        </p>
      </div>
      {/* Warning Example */}
      <div style={warningStyle}>
        <h3>Warning</h3>
        <p>
          This is a warning message to alert users to take caution with a
          particular action.
        </p>
      </div>
      {/* Hover Information Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <p>
          Hover over this{' '}
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
              This is additional hover information.
            </span>
          </span>{' '}
          to see more details.
        </p>
      </div>
      {/* Progress Bar Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Progress Bar</h3>
        <div style={progressContainerStyle}>
          <div style={progressBarStyle}></div>
        </div>
      </div>
      {/* Spinner Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Spinner</h3>
        <div style={spinnerStyle}></div>
      </div>
      {/* Dropdown Menu Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Dropdown Menu</h3>
        <select
          value={dropdownValue}
          onChange={e => setDropdownValue(e.target.value)}
          style={dropdownStyle}
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      {/* Checkbox Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Checkbox</h3>
        <label>
          <input
            type="checkbox"
            checked={checkboxChecked}
            onChange={e => setCheckboxChecked(e.target.checked)}
            style={checkboxStyle}
          />{' '}
          Check me!
        </label>
      </div>
      {/* Slider Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Slider Example</h3>
        <input
          type="range"
          value={sliderValue}
          onChange={e => setSliderValue(Number(e.target.value))}
          style={sliderStyle}
          min="0"
          max="100"
        />
        <p>Value: {sliderValue}</p>
      </div>
      {/* Dragging Handle Example */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Dragging Handle</h3>
        <div
          draggable
          style={draggingHandleStyle}
          onDragStart={e => {
            e.dataTransfer.setData('text/plain', 'DraggingHandle');
          }}
        >
          Drag Me
        </div>
      </div>
      {/* Typography Examples */}
      <div style={{ textAlign: 'center', marginTop: spacing.large }}>
        <h3>Typography Examples</h3>
        <h1
          style={{
            fontFamily: typography.primaryFont,
            fontSize: '2.5rem',
            margin: spacing.small,
          }}
        >
          H1 - Title
        </h1>
        <h2
          style={{
            fontFamily: typography.primaryFont,
            fontSize: '2rem',
            margin: spacing.small,
          }}
        >
          H2 - Subtitle
        </h2>
        <h3
          style={{
            fontFamily: typography.primaryFont,
            fontSize: '1.5rem',
            margin: spacing.small,
          }}
        >
          H3 - Section Title
        </h3>
        <p
          style={{
            fontFamily: typography.fallbackFont,
            fontSize: '1rem',
            margin: spacing.small,
          }}
        >
          Body text example: Lorem ipsum dolor sit amet, consectetur adipiscing
          elit.
        </p>
        <p
          style={{
            fontFamily: typography.fallbackFont,
            fontSize: '0.8rem',
            margin: spacing.small,
          }}
        >
          Caption text example: This is a caption.
        </p>
      </div>
    </div>
  );
}

export default DesignPrinciplesDemo;
