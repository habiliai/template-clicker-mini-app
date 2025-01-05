import { useMutation, useQuery } from '@tanstack/react-query';
import { DailyBoosterItem, BoosterItem } from '../models/booster.ts';
import { useTWASession } from '../contexts/TWASessionContext.tsx';
import axios from 'axios';

export function useBoosterActions() {
  const { session } = useTWASession();

  return {
    listDailyBoosters: () =>
      useQuery<DailyBoosterItem[]>({
        queryKey: ['boosters.list.daily'],
        queryFn: async () => {
          if (!session) {
            throw new Error('Session not set');
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/gameEssentials/listDailyBoosters`,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.accessToken}`,
                },
              },
            );
            return res.data;
          } catch (error) {
            console.error(error);
            throw new Error(`Failed to get game profile: ${error}`);
          }
        },
        enabled: !!session,
      }),
    listBoosters: () =>
      useQuery<BoosterItem[]>({
        queryKey: ['boosters.list'],
        queryFn: async () => {
          if (!session) {
            throw new Error('Session not set');
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/gameEssentials/listBoosters`,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.accessToken}`,
                },
              },
            );
            return res.data;
          } catch (error) {
            console.error(error);
            throw new Error(`Failed to get game profile: ${error}`);
          }
        },
      }),
    upgradeBooster: useMutation({
      mutationKey: ['boosters.upgrade'],
      mutationFn: async (id: number) => {
        if (!session) {
          throw new Error('Session not set');
        }

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_ENDPOINT}/gameEssentials/upgradeBooster`,
            { id },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
              },
            },
          );
          return res.data as BoosterItem;
        } catch (error) {
          console.error(error);
          throw new Error(`Failed to upgrade booster: ${error}`);
        }
      },
    }),
  };
}
