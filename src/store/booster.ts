import { BoosterItem, DailyBoosterItem } from '../models/booster.ts';
import { create } from 'zustand';
import { useBoosterActions } from '../actions/boosters.ts';
import { useEffect } from 'react';

interface BoosterStoreState {
  initialized: boolean;
  boosters: BoosterItem[];
  dailyBoosters: DailyBoosterItem[];

  init(args: {
    boosters?: BoosterItem[];
    dailyBoosters?: DailyBoosterItem[];
  }): void;
  replaceBooster(booster: BoosterItem): void;
  consumeDailyBooster(boosterId: number): DailyBoosterItem | null;
}

const boosterStore = create<BoosterStoreState>((set, get) => ({
  initialized: false,
  boosters: [],
  dailyBoosters: [],

  init({ boosters, dailyBoosters }) {
    if (boosters) {
      set({ boosters });
    }
    if (dailyBoosters) {
      set({ dailyBoosters });
    }
    set({ initialized: true });
  },
  replaceBooster(booster: BoosterItem) {
    const { boosters } = get();
    const foundBooster = boosters.find((b) => b.id === booster.id);
    if (!foundBooster) {
      return;
    }

    set({
      boosters: boosters.map((b) => {
        if (b.id === booster.id) {
          return booster;
        }
        return b;
      }),
    });
  },

  consumeDailyBooster(boosterId: number) {
    const { dailyBoosters } = get();
    const dailyBooster = dailyBoosters.find((b) => b.id === boosterId);
    if (!dailyBooster) {
      return null;
    }

    if (dailyBooster.remainingAmount <= 0) {
      return null;
    }
    dailyBooster.remainingAmount -= 1;
    set({ dailyBoosters: [...dailyBoosters] });

    return dailyBooster;
  },
}));

const useBoosterStore = () => {
  const {
    initialized,
    boosters,
    dailyBoosters,
    replaceBooster,
    init,
    consumeDailyBooster,
  } = boosterStore();

  const {
    listBoosters,
    listDailyBoosters,
    upgradeBooster: { mutateAsync: upgrade },
  } = useBoosterActions();
  const { data: boosterItems, isFetched: boosterItemFetched } = listBoosters();
  const { data: dailyBoosterItems, isFetched: dailyItemFetched } =
    listDailyBoosters();

  useEffect(() => {
    if (initialized || !boosterItemFetched || !dailyItemFetched) {
      return;
    }
    if (boosterItems) init({ boosters: boosterItems });
    if (dailyBoosterItems) init({ dailyBoosters: dailyBoosterItems });
  }, [boosterItems, dailyBoosterItems]);

  return {
    boosters,
    dailyBoosters,
    upgradeBooster: async (boosterId: number) => {
      const booster = await upgrade(boosterId);
      replaceBooster(booster);
    },
    refillDailyBooster: (boosterId: number) => {
      const item = consumeDailyBooster(boosterId);
      if (!item) {
        return;
      }
      // TODO: implement refill logic
    },
  };
};

export default useBoosterStore;
