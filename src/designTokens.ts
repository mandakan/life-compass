export const colors = {
  primary: '#3490dc',
  secondary: '#ffed4a',
  accent: '#e3342f',
  neutral: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  light: {
    background: '#ffffff',
    text: '#212529',
  },
  dark: {
    background: '#212529',
    text: '#f8f9fa',
  },
};

export const typography = {
  primaryFont: "'Inter', sans-serif",
  fallbackFont: 'sans-serif',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const transitions = {
  fast: '150ms',
  medium: '300ms',
  slow: '500ms',
};

export const interactiveStates = {
  hover: {
    brightness: '0.95',
    shadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  focus: {
    outline: '2px solid #3490dc',
    outlineOffset: '2px',
  },
  active: {
    scale: '0.98',
  },
};

export const callouts = {
  callout: {
    border: colors.primary,
    backgroundLight: colors.neutral[100],
    backgroundDark: colors.neutral[800],
  },
  warning: {
    border: colors.accent,
    backgroundLight: colors.neutral[200],
    backgroundDark: colors.neutral[700],
  },
};

export const tooltip = {
  width: '200px',
  background: colors.neutral[900],
  color: '#fff',
  borderRadius: '6px',
  padding: '0.5rem',
};

export const inputs = {
  textLight: '#000000',
  textDark: '#ffffff',
};

// Additional tokens for spacing and border radius
export const spacing = {
  small: '0.5rem',
  medium: '1rem',
  large: '2rem',
};

export const borderRadius = {
  small: '4px',
  medium: '8px',
};
