import React from 'react';
import { colors, typography, interactiveStates, transitions, callouts, tooltip, inputs } from '../designTokens';

function DesignPrinciplesDemo() {
  const [cardHovered, setCardHovered] = React.useState(false);
  const [buttonHovered, setButtonHovered] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [hoverActive, setHoverActive] = React.useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const theme = darkMode ? colors.dark : colors.light;

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    minHeight: '100vh',
    fontFamily: typography.primaryFont,
    transition: `background-color ${transitions.medium}, color ${transitions.medium}`,
    padding: '2rem'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${darkMode ? colors.neutral[700] : colors.neutral[300]}`,
    transition: `all ${transitions.medium}`,
    cursor: 'pointer',
    margin: '1rem',
    textAlign: 'center'
  };

  const cardHoverStyle: React.CSSProperties = {
    filter: `brightness(${interactiveStates.hover.brightness})`,
    boxShadow: interactiveStates.hover.shadow
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    border: 'none',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    transition: `all ${transitions.fast}`,
    cursor: 'pointer',
    margin: '0.5rem'
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: `1px solid ${darkMode ? colors.neutral[600] : colors.neutral[300]}`,
    fontFamily: typography.primaryFont,
    margin: '0.5rem',
    width: '100%',
    maxWidth: '300px',
    color: darkMode ? inputs.textDark : inputs.textLight
  };

  const calloutStyle: React.CSSProperties = {
    borderLeft: `4px solid ${callouts.callout.border}`,
    backgroundColor: darkMode ? callouts.callout.backgroundDark : callouts.callout.backgroundLight,
    padding: '1rem',
    margin: '1rem 0'
  };

  const warningStyle: React.CSSProperties = {
    borderLeft: `4px solid ${callouts.warning.border}`,
    backgroundColor: darkMode ? callouts.warning.backgroundDark : callouts.warning.backgroundLight,
    padding: '1rem',
    margin: '1rem 0'
  };

  const hoverInfoStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderBottom: '1px dotted gray'
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
    transition: `opacity ${transitions.fast}`
  };

  const tooltipVisibleStyle: React.CSSProperties = {
    visibility: 'visible',
    opacity: 1
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Design Principles Demo</h1>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          style={buttonStyle}
          onClick={toggleDarkMode}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onFocus={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = interactiveStates.focus.outline;
            (e.currentTarget as HTMLButtonElement).style.outlineOffset = interactiveStates.focus.outlineOffset;
          }}
          onBlur={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = 'none';
          }}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
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
          This card demonstrates usage of design tokens for typography, colors, interactive states, and transitions.
        </p>
      </div>
      {/* Button Example */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          style={buttonStyle}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.filter = `brightness(${interactiveStates.hover.brightness})`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'none';
          }}
          onFocus={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = interactiveStates.focus.outline;
            (e.currentTarget as HTMLButtonElement).style.outlineOffset = interactiveStates.focus.outlineOffset;
          }}
          onBlur={e => {
            (e.currentTarget as HTMLButtonElement).style.outline = 'none';
          }}
        >
          Example Button
        </button>
      </div>
      {/* Input Field Example */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <input
          type="text"
          placeholder="Sample Input"
          style={inputStyle}
        />
      </div>
      {/* Callout Example */}
      <div style={calloutStyle}>
        <h3>Callout</h3>
        <p>This is an informational callout intended to draw attention to important details.</p>
      </div>
      {/* Warning Example */}
      <div style={warningStyle}>
        <h3>Warning</h3>
        <p>This is a warning message to alert users to take caution with a particular action.</p>
      </div>
      {/* Hover Information Example */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>
          Hover over this{' '}
          <span
            style={hoverInfoStyle}
            onMouseEnter={() => setHoverActive(true)}
            onMouseLeave={() => setHoverActive(false)}
          >
            text
            <span style={{ ...tooltipStyle, ...(hoverActive ? tooltipVisibleStyle : {}) }}>
              This is additional hover information.
            </span>
          </span>
          {' '}to see more details.
        </p>
      </div>
    </div>
  );
}

export default DesignPrinciplesDemo;
