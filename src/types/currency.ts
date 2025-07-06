import { type ImageSource } from 'expo-image';

import { BucksIcon, CoinsIcon, MedalsIcon } from '@/assets/images/currency';

export const enum CurrencyId {
  COINS = 'b3f4a8f0-dd58-4e3f-ae0a-7a17418fc903',
  BUCKS = 'ed4812be-4dcd-446b-b61e-96d8be8f6121',
  MEDALS = 'daf33d00-75b5-4b0e-8cbc-8219b9dcb7ca',
}

export const enum Currency {
  COINS = 'coins',
  BUCKS = 'bucks',
  MEDALS = 'medals',
}

export const CURRENCY_ICONS = Object.freeze<Record<Currency, ImageSource>>({
  [Currency.COINS]: CoinsIcon,
  [Currency.BUCKS]: BucksIcon,
  [Currency.MEDALS]: MedalsIcon,
});
