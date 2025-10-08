import { type ImageSource } from 'expo-image';

import {
  AbsaIcon,
  ClairenIcon,
  EtalusIcon,
  FleetIcon,
  ForsburnIcon,
  GalvanIcon,
  KraggIcon,
  LoxodontIcon,
  MaypulIcon,
  OlympiaIcon,
  OrcaneIcon,
  RannoIcon,
  WrastorIcon,
  ZetterburnIcon,
} from '@/assets/images/character';

export enum Character {
  ABSA = 'Abs',
  CLAIREN = 'Cla',
  ETALUS = 'Eta',
  FLEET = 'Fle',
  FORSBURN = 'For',
  GALVAN = 'Gal',
  KRAGG = 'Kra',
  LOXODONT = 'Lox',
  MAYPUL = 'May',
  OLYMPIA = 'Oly',
  ORCANE = 'Orc',
  RANNO = 'Ran',
  WRASTOR = 'Wra',
  ZETTERBURN = 'Zet',
}

export const CHARACTER_ICONS = Object.freeze<Record<Character, ImageSource>>({
  [Character.ABSA]: AbsaIcon,
  [Character.CLAIREN]: ClairenIcon,
  [Character.ETALUS]: EtalusIcon,
  [Character.FLEET]: FleetIcon,
  [Character.FORSBURN]: ForsburnIcon,
  [Character.GALVAN]: GalvanIcon,
  [Character.KRAGG]: KraggIcon,
  [Character.LOXODONT]: LoxodontIcon,
  [Character.MAYPUL]: MaypulIcon,
  [Character.OLYMPIA]: OlympiaIcon,
  [Character.ORCANE]: OrcaneIcon,
  [Character.RANNO]: RannoIcon,
  [Character.WRASTOR]: WrastorIcon,
  [Character.ZETTERBURN]: ZetterburnIcon,
});
