import { create } from 'zustand';
import { UserGameContext } from '../models/game.ts';

interface GameStoreState {
  userGameContext: UserGameContext | null;
  updateGameContext: (userGameContext: UserGameContext) => void;
  points: number;
  energy: number;
  lastUpdated: number;
  earnPoints: (increasePoint: number, consumeEnergy: number) => boolean;
  consumePoints: (consumePoint: number) => boolean;
  renewEnergy: () => void;
}

const useGameStore = create<GameStoreState>((set, get) => ({
  userGameContext: null,
  points: 0,
  energy: 0,
  lastUpdated: Date.now(),
  updateGameContext: (userGameContext: UserGameContext) => {
    set({
      userGameContext,
      points: userGameContext.pointBalance,
      energy: userGameContext.energyBalance,
      lastUpdated: Date.now(),
    });
  },
  earnPoints: (increasePoint: number, consumeEnergy: number) => {
    if (get().energy < consumeEnergy) {
      return false;
    }
    set((state) => ({
      points: state.points + increasePoint,
      energy: state.energy - consumeEnergy,
      lastUpdated: Date.now(),
    }));
    return true;
  },
  consumePoints: (consumePoint: number) => {
    if (get().points < consumePoint) {
      return false;
    }
    set((state) => ({
      points: state.points - consumePoint,
      lastUpdated: Date.now(),
    }));
    return true;
  },
  renewEnergy: () => {
    const { energy, userGameContext, lastUpdated } = get();
    if (!userGameContext || energy >= userGameContext.energyLimit) {
      return;
    }
    const now = Date.now();
    const elapsedSeconds = Math.floor(
      (now - lastUpdated) / userGameContext.energyRefillInterval,
    ); // calculate elapsed time since last update
    const newEnergy = Math.min(
      userGameContext.energyLimit,
      energy + elapsedSeconds,
    );

    set({ energy: newEnergy, lastUpdated: now });
  },
}));

export default useGameStore;
