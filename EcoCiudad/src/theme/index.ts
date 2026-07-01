import { type ThemeColors, citizenThemeColors, operatorThemeColors, adminThemeColors } from './colors/theme-colors';
import { typography, textStyles } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './radius';
import { elevation } from './elevation';
import { sizes } from './sizes';
import { animations } from './animations';

export type ThemeRole = 'citizen' | 'operator' | 'admin';

export interface Theme {
  role: ThemeRole;
  colors: ThemeColors;
  typography: typeof typography;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  elevation: typeof elevation;
  sizes: typeof sizes;
  animations: typeof animations;
}

export const citizenTheme: Theme = {
  role: 'citizen',
  colors: citizenThemeColors,
  typography,
  textStyles,
  spacing,
  borderRadius,
  elevation,
  sizes,
  animations,
};

export const operatorTheme: Theme = {
  role: 'operator',
  colors: operatorThemeColors,
  typography,
  textStyles,
  spacing,
  borderRadius,
  elevation,
  sizes,
  animations,
};

export const adminTheme: Theme = {
  role: 'admin',
  colors: adminThemeColors,
  typography,
  textStyles,
  spacing,
  borderRadius,
  elevation,
  sizes,
  animations,
};

export type { ThemeColors } from './colors/theme-colors';
export type { ElevationLevel } from './elevation';
