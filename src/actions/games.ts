import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTWASession } from '../contexts/TWASessionContext.tsx';
import { UserGameContext } from '../models/game.ts';

export function useGameActions() {
  const { session } = useTWASession();

  return {
    getGameContext: () =>
      useQuery<UserGameContext>({
        queryKey: ['users.getGameContext'],
        queryFn: async () => {
          if (!session) {
            throw new Error('Session not set');
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/gameEssentials/getGameContext`,
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
    syncGameContext: () =>
      useMutation({
        mutationKey: ['users.syncGameContext'],
        mutationFn: async ({
          pointsBalance,
          energyBalance,
        }: {
          pointsBalance: number;
          energyBalance: number;
        }) => {
          if (!session) {
            throw new Error('Session not set');
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/gameEssentials/syncGameContext`,
              {
                currentEnergy: energyBalance,
                points: pointsBalance,
                timestamp: Date.now(),
              },
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
  };
}
