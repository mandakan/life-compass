import React from 'react';
import { colors, typography, interactiveStates, breakpoints, transitions } from '../designTokens';

function DesignPrinciplesDemo() {
  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.light.background,
    color: colors.light.text,
    fontFamily: typography.primaryFont,
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: `all ${transitions.medium}`,
    cursor: 'pointer',
    margin: '1rem',
    textAlign: 'center'
  };

  const cardHoverStyle: React.CSSProperties = {
    filter: `brightness(${interactiveStates.hover.brightness})`,
    boxShadow: interactiveStates.hover.shadow
  };

  const [hovered, setHovered] = React.useState(false);

  return (
    <div style={{ padding: '2rem', fontFamily: typography.primaryFont }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Design Principles Demo</h1>
      <div
        style={{ ...cardStyle, ...(hovered ? cardHoverStyle : {}) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h2>Card Component</h2>
        <p>
          This card demonstrates usage of design tokens for typography, colors, interactive states, and transitions.
        </p>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          style={{
            backgroundColor: colors.primary,
            border: 'none',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            transition: `all ${transitions.fast}`,
            cursor: 'pointer'
          }}
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
    </div>
  );
}

export default DesignPrinciplesDemo;
