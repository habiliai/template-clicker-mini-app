import { ReferralBonusItem, ReferredUser } from '../models/referral.ts';
import { create } from 'zustand';
import { useReferralActions } from '../actions/referrals.ts';
import { useEffect } from 'react';

interface ReferralStoreState {
  initialized: boolean;
  friends: ReferredUser[];
  bonusItems: ReferralBonusItem[];
  init(args: {
    friends?: ReferredUser[];
    bonusItems?: ReferralBonusItem[];
  }): void;
}

const referralStore = create<ReferralStoreState>((set) => ({
  friends: [],
  bonusItems: [],
  initialized: false,
  init({ friends, bonusItems }) {
    if (friends) {
      set({ friends });
    }
    if (bonusItems) {
      set({ bonusItems });
    }

    set({ initialized: true });
  },
}));

const useReferralStore = () => {
  const { friends, bonusItems, init, initialized } = referralStore();
  const { listReferralBonusItems, listReferrals } = useReferralActions();

  const { data: friendsList, isFetched: referralsFetched } = listReferrals();
  const { data: bonusItemsList, isFetched: bonusItemsFetched } =
    listReferralBonusItems();

  useEffect(() => {
    if (initialized || !referralsFetched || !bonusItemsFetched) {
      return;
    }

    if (friendsList) init({ friends: friendsList });
    if (bonusItemsList) init({ bonusItems: bonusItemsList });
  }, [friendsList, bonusItemsList]);

  return {
    friends,
    bonusItems,
  };
};

export default useReferralStore;
