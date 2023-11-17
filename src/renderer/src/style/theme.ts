// theme.ts
import { DefaultTheme } from 'styled-components';

const colors = {
  primary: '#3498db',
  secondary: '#9b59b6',
  tertiary: '#e74c3c',
  quaternary: '#2ecc71',
  green: {
    main: '#27ae60',
  },
  red: {
    main: '#c0392b',
    900: '#7d3c3c',
  },
  yellow: {
    main: '#f1c40f',
    800: '#d4ac0d',
  },
  gray: {
    200: '#f7dc6f',
    300: '#d5dbdb',
  },
  black: '#34495e',
  white: '#ecf0f1',
  purple: {
    500: '#8e44ad',
  },
};

export const theme: DefaultTheme = {
  tabBarHeight: 50,
  screenHeight: window.innerHeight,
  screenWidth: window.innerWidth,
  dark: false,
  inRangeColor: colors.green.main,
  belowRangeColor: colors.red.main,
  aboveRangeColor: colors.yellow.main,
  severeBelowRange: colors.red[900],
  severeAboveRange: colors.yellow[800],
  backgroundColor: colors.gray[200],
  textColor: colors.black,
  buttonTextColor: colors.white,
  buttonBackgroundColor: colors.purple[500],
  accentColor: colors.purple[500],
  shadowColor: colors.black,
  white: colors.white,
  borderColor: colors.gray[300],
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  lineHeight: 1.5,
  textSize: 16,
  borderRadius: 8,
  determineBgColorByGlucoseValue: (bgValue: number) => {
    // Implement your logic here to determine background color based on bgValue
    return colors.primary; // Placeholder, replace with actual logic
  },
  getShadowStyles: (elevation: number, color = colors.black) => {
    const opacity = elevation * 0.1;
    return `box-shadow: 0px ${elevation}px ${elevation * 2}px rgba(${color}, ${opacity});`;
  },
  shadow: {
    default: `box-shadow: 0px 1px 2px rgba(${colors.black}, 0.1);`,
    small: `box-shadow: 0px 0.5px 1px rgba(${colors.black}, 0.05);`,
    dark: `box-shadow: 0px 1px 2px rgba(${colors.black}, 0.2);`,
    bright: `box-shadow: 0px 2px 4px rgba(${colors.white}, 0.3);`,
  },
};

export default theme;

export type ThemeType = typeof theme;
