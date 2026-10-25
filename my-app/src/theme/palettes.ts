/**
 * Rendezvoo themes. Both come from the Figma palettes:
 *   Cactus flower: #E491A6  #845763  #92E4BA  #90C67F
 *   Lotus garden:  #ADEBB3  #FF857A  #EBAEE6  #6B403C
 * The app is dark (like the wireframes), so each palette is applied to a
 * dark background derived from its darkest color.
 */

export type ThemeName = 'cactus' | 'lotus';

export interface AppColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  highlight: string;
}

export interface Palette {
  name: ThemeName;
  label: string;
  swatches: string[];
  colors: AppColors;
  /** Colors a group can be tagged with (shown in group settings). */
  groupColors: string[];
}

export const PALETTES: Record<ThemeName, Palette> = {
  cactus: {
    name: 'cactus',
    label: 'Cactus flower',
    swatches: ['#E491A6', '#845763', '#92E4BA', '#90C67F'],
    colors: {
      bg: '#1B1317',
      surface: '#271C21',
      surfaceAlt: '#33242B',
      border: '#845763',
      text: '#FBEFF2',
      textMuted: '#C9A9B3',
      primary: '#E491A6',
      onPrimary: '#2A1018',
      accent: '#92E4BA',
      onAccent: '#0E2A1D',
      highlight: '#90C67F',
    },
    groupColors: ['#E491A6', '#92E4BA', '#90C67F', '#B97C8D'],
  },
  lotus: {
    name: 'lotus',
    label: 'Lotus garden',
    swatches: ['#ADEBB3', '#FF857A', '#EBAEE6', '#6B403C'],
    colors: {
      bg: '#1C1413',
      surface: '#2A1D1B',
      surfaceAlt: '#382725',
      border: '#6B403C',
      text: '#FFF1EF',
      textMuted: '#D1AFAA',
      primary: '#FF857A',
      onPrimary: '#2B0E0B',
      accent: '#EBAEE6',
      onAccent: '#2A1029',
      highlight: '#ADEBB3',
    },
    groupColors: ['#FF857A', '#EBAEE6', '#ADEBB3', '#B07A74'],
  },
};

export const THEME_ORDER: ThemeName[] = ['cactus', 'lotus'];
