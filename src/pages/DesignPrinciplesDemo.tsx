import React from 'react';
import { colors, typography, interactiveStates, breakpoints, transitions } from '../designTokens';

function DesignPrinciplesDemo() {
  const [cardHovered, setCardHovered] = React.useState(false);
  const [buttonHovered, setButtonHovered] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

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
    maxWidth: '300px'
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
    </div>
  );
}

export default DesignPrinciplesDemo;
