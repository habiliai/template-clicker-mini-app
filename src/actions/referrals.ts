import { useQuery } from '@tanstack/react-query';
import { ReferralBonusItem, ReferredUser } from '../models/referral.ts';
import { useTWASession } from '../contexts/TWASessionContext.tsx';
import axios from 'axios';

export function useReferralActions() {
  const { session } = useTWASession();

  return {
    listReferrals: () =>
      useQuery<ReferredUser[]>({
        queryKey: ['referrals.list'],
        queryFn: async () => {
          if (!session) {
            throw new Error('Session not set');
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/referrals/listReferrals`,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.accessToken}`,
                },
              },
            );
            return res.data.map(
              (data: any) =>
                ({
                  authUserId: data.referredUserId,
                  username: data.referredUserName,
                  joinedAt: data.referredJoinedAt,
                  createdAt: data.createdAt,
                }) as ReferredUser,
            );
          } catch (error) {
            throw new Error(`Failed to get referrals: ${error}`);
          }
        },
        enabled: !!session,
      }),

    listReferralBonusItems: () =>
      useQuery<ReferralBonusItem[]>({
        queryKey: ['referrals.bonus.list'],
        queryFn: async () => {
          if (!session) {
            throw new Error('Session not set');
          }
          // TODO: get items from server
          await new Promise((resolve) => setTimeout(resolve, 500));
          return [
            {
              id: 1,
              title: 'Invite a friend',
              description: 'Invite a friend to NutCoin',
              points: 10,
            },
            {
              id: 2,
              title: 'Invite a friend with Telegram Premium',
              description: 'Invite a friend with Telegram Premium to NutCoin',
              points: 50,
            },
          ];
        },
        enabled: !!session,
      }),
  };
}
