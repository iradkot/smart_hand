import { DefaultTheme } from 'styled-components';

// Define a base color palette
const baseColors = {
  primary: '#007bff', // A vibrant blue for primary actions
  secondary: '#6c757d', // A neutral tone for secondary actions or elements
  success: '#28a745', // A positive, success-indicating green
  danger: '#dc3545', // A strong red for errors or warnings
  warning: '#ffc107', // An attention-grabbing yellow
  info: '#17a2b8', // A calming blue for informational messages
};

// Define shades for text, backgrounds, and borders
const shades = {
  dark: '#343a40', // Dark shade for text or elements
  light: '#f8f9fa', // Light shade for backgrounds
  lighter: '#e9ecef', // Even lighter shade for card backgrounds or similar
};

// Enhanced theme with improved color scheme
export const theme: DefaultTheme = {
  tabBarHeight: 50,
  screenHeight: window.innerHeight,
  screenWidth: window.innerWidth,
  dark: false,
  inRangeColor: baseColors.success,
  belowRangeColor: baseColors.danger,
  aboveRangeColor: baseColors.warning,
  severeBelowRange: '#c82333', // Darker shade of danger for severe conditions
  severeAboveRange: '#e0a800', // Darker shade of warning for extreme conditions
  backgroundColor: shades.lighter,
  textColor: shades.dark,
  buttonTextColor: shades.light,
  buttonBackgroundColor: baseColors.primary,
  accentColor: baseColors.info,
  shadowColor: 'rgba(0,0,0,0.2)',
  white: shades.light,
  borderColor: '#dee2e6',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  lineHeight: 1.5,
  textSize: 16,
  borderRadius: 8,
  determineBgColorByGlucoseValue: (bgValue: number) => {
    // Example logic: Change color based on glucose value
    if (bgValue < 70) return baseColors.danger;
    else if (bgValue <= 180) return baseColors.success;
    else return baseColors.warning;
  },
  getShadowStyles: (elevation: number, color = 'rgba(0,0,0,0.1)') => {
    const opacity = elevation * 0.1;
    return `box-shadow: 0px ${elevation}px ${elevation * 2}px ${color}, 0px ${elevation / 2}px ${elevation}px rgba(0,0,0,${opacity});`;
  },
  shadow: {
    default: `box-shadow: 0px 1px 2px rgba(0,0,0,0.1);`,
    small: `box-shadow: 0px 0.5px 1px rgba(0,0,0,0.05);`,
    dark: `box-shadow: 0px 1px 2px rgba(0,0,0,0.2);`,
    bright: `box-shadow: 0px 2px 4px rgba(255,255,255,0.3);`,
  },
  shades
};

export default theme;

export type ThemeType = typeof theme;
