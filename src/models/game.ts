export interface UserGameContext {
  levelName: string;
  energyLimit: number;
  remainingEnergyRefills: number;
  totalEarnedPoints: number;
  energyBalance: number;
  pointBalance: number;
  multitapLevel: number;
  energyLimitLevel: number;
  lastEnergyRefilledAt: Date;
  lastEnergyUpdatedAt: Date;
  lastPointUpdatedAt: Date;
  maxEnergyRefillsPerDay: number;
  pointEarnsPerClick: number;
  energyConsumesPerClick: number;
  energyRefillInterval: number;
}
