import { useColorScheme } from 'react-native';

/**
 * Buxoro koshini — ranglar tizimi.
 * lojuvard (ko'k), feruza, oltin, anor, bodom — sirlangan kafel dunyosidan.
 */
export type Palette = {
  dark: boolean;
  ground: string;
  surface: string;
  surface2: string;
  line: string;
  line2: string;
  ink: string;
  ink2: string;
  muted: string;
  lojuvard: string;
  lojuvardSoft: string;
  feruza: string;
  feruzaSoft: string;
  oltin: string;
  oltinSoft: string;
  anor: string;
  anorSoft: string;
  bodom: string;
  bodomSoft: string;
  onAccent: string;
};

export const LIGHT: Palette = {
  dark: false,
  ground: '#E9E3D7',
  surface: '#FCFAF6',
  surface2: '#F3EFE6',
  line: '#DBD3C3',
  line2: '#C6BCA7',
  ink: '#171A21',
  ink2: '#3D4453',
  muted: '#6E7383',
  lojuvard: '#1D3F91',
  lojuvardSoft: '#E0E5F3',
  feruza: '#0F7A80',
  feruzaSoft: '#DCEDED',
  oltin: '#98650F',
  oltinSoft: '#F4EBD8',
  anor: '#93292B',
  anorSoft: '#F5E3E1',
  bodom: '#6B3B7A',
  bodomSoft: '#EFE4F1',
  onAccent: '#FCFAF6',
};

export const DARK: Palette = {
  dark: true,
  ground: '#111319',
  surface: '#191C25',
  surface2: '#20242F',
  line: '#2B3040',
  line2: '#3C4356',
  ink: '#EDE8DE',
  ink2: '#C6C2B8',
  muted: '#8B90A2',
  lojuvard: '#82A2F2',
  lojuvardSoft: '#1C2540',
  feruza: '#3FB9BC',
  feruzaSoft: '#102C2E',
  oltin: '#D3A44D',
  oltinSoft: '#2C2416',
  anor: '#DD7C71',
  anorSoft: '#331D1C',
  bodom: '#B58AC6',
  bodomSoft: '#251A2C',
  onAccent: '#111319',
};

export type ThemeMode = 'system' | 'light' | 'dark';

export function paletteFor(mode: ThemeMode, system: string | null | undefined): Palette {
  if (mode === 'light') return LIGHT;
  if (mode === 'dark') return DARK;
  return system === 'dark' ? DARK : LIGHT;
}

export function useSystemScheme() {
  return useColorScheme();
}

export const F = {
  display: 'Jost_600SemiBold',
  displayMed: 'Jost_500Medium',
  body: 'Karla_400Regular',
  bodyMed: 'Karla_500Medium',
  bodySemi: 'Karla_600SemiBold',
  bodyBold: 'Karla_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMed: 'IBMPlexMono_500Medium',
} as const;

export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 30 } as const;
export const R = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
