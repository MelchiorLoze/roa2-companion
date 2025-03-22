import {
  ClairenIcon,
  EtalusIcon,
  FleetIcon,
  ForsburnIcon,
  KraggIcon,
  LoxodontIcon,
  MaypulIcon,
  OrcaneIcon,
  RannoIcon,
  WrastorIcon,
  ZetterburnIcon,
} from '@/assets/images';

export enum Character {
  CLAIREN = 'cla',
  ETALUS = 'eta',
  FLEET = 'fle',
  FORSBURN = 'for',
  KRAGG = 'kra',
  LOXODONT = 'lox',
  MAYPUL = 'may',
  //OLYMPIA = 'oly',
  ORCANE = 'orc',
  RANNO = 'ran',
  WRASTOR = 'wra',
  ZETTERBURN = 'zet',
}

export const CHARACTER_NAMES: Record<Character, string> = {
  [Character.CLAIREN]: 'Clairen',
  [Character.ETALUS]: 'Etalus',
  [Character.FLEET]: 'Fleet',
  [Character.FORSBURN]: 'Forsburn',
  [Character.KRAGG]: 'Kragg',
  [Character.LOXODONT]: 'Loxodont',
  [Character.MAYPUL]: 'Maypul',
  //[Character.OLYMPIA]: 'Olympia',
  [Character.ORCANE]: 'Orcane',
  [Character.RANNO]: 'Ranno',
  [Character.WRASTOR]: 'Wrastor',
  [Character.ZETTERBURN]: 'Zetterburn',
};

export const CHARACTER_ICONS: Record<Character, any> = {
  [Character.CLAIREN]: ClairenIcon,
  [Character.ETALUS]: EtalusIcon,
  [Character.FLEET]: FleetIcon,
  [Character.FORSBURN]: ForsburnIcon,
  [Character.KRAGG]: KraggIcon,
  [Character.LOXODONT]: LoxodontIcon,
  [Character.MAYPUL]: MaypulIcon,
  // [Character.OLYMPIA]: OlympiaIcon,
  [Character.ORCANE]: OrcaneIcon,
  [Character.RANNO]: RannoIcon,
  [Character.WRASTOR]: WrastorIcon,
  [Character.ZETTERBURN]: ZetterburnIcon,
};
