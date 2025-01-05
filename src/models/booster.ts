export type BoosterType = 'ENERGY_LIMIT' | 'MULTITAP';

export interface BoosterItem {
  id: number;
  title: string;
  description: string;
  type: BoosterType;
  currentPrice: number;
  currentLevel: number;
}

export interface DailyBoosterItem {
  id: number;
  title: string;
  description: string;
  maxAmount: number;
  remainingAmount: number;
}
