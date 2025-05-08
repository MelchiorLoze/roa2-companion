import {
  ClairenIcon,
  EtalusIcon,
  FleetIcon,
  ForsburnIcon,
  KraggIcon,
  LoxodontIcon,
  MaypulIcon,
  OlympiaIcon,
  OrcaneIcon,
  RannoIcon,
  WrastorIcon,
  ZetterburnIcon,
} from '@/assets/images';

export enum Character {
  CLAIREN = 'Cla',
  ETALUS = 'Eta',
  FLEET = 'Fle',
  FORSBURN = 'For',
  KRAGG = 'Kra',
  LOXODONT = 'Lox',
  MAYPUL = 'May',
  OLYMPIA = 'Oly',
  ORCANE = 'Orc',
  RANNO = 'Ran',
  WRASTOR = 'Wra',
  ZETTERBURN = 'Zet',
}

export const CHARACTER_NAMES: Readonly<Record<Character, string>> = Object.freeze({
  [Character.CLAIREN]: 'Clairen',
  [Character.ETALUS]: 'Etalus',
  [Character.FLEET]: 'Fleet',
  [Character.FORSBURN]: 'Forsburn',
  [Character.KRAGG]: 'Kragg',
  [Character.LOXODONT]: 'Loxodont',
  [Character.MAYPUL]: 'Maypul',
  [Character.OLYMPIA]: 'Olympia',
  [Character.ORCANE]: 'Orcane',
  [Character.RANNO]: 'Ranno',
  [Character.WRASTOR]: 'Wrastor',
  [Character.ZETTERBURN]: 'Zetterburn',
});

export const CHARACTER_ICONS: Readonly<Record<Character, any>> = Object.freeze({
  [Character.CLAIREN]: ClairenIcon,
  [Character.ETALUS]: EtalusIcon,
  [Character.FLEET]: FleetIcon,
  [Character.FORSBURN]: ForsburnIcon,
  [Character.KRAGG]: KraggIcon,
  [Character.LOXODONT]: LoxodontIcon,
  [Character.MAYPUL]: MaypulIcon,
  [Character.OLYMPIA]: OlympiaIcon,
  [Character.ORCANE]: OrcaneIcon,
  [Character.RANNO]: RannoIcon,
  [Character.WRASTOR]: WrastorIcon,
  [Character.ZETTERBURN]: ZetterburnIcon,
});
