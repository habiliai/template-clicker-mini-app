import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from '../models/user.ts';

export function useTwaAuthActions() {
  return {
    signIn: useMutation({
      mutationKey: ['users.signIn'],
      mutationFn: async ({
        telegramInitData,
      }: {
        telegramInitData: string;
      }) => {
        if (!telegramInitData) {
          throw new Error('No telegramInitData');
        }

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_ENDPOINT}/twaAuth/signIn`,
            {
              telegramInitData,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const accessToken = res.data.accessToken;
          return {
            accessToken,
            user: {
              id: res.data.id,
              telegramId: res.data.telegramId,
              telegramUsername: res.data.telegramUsername,
            },
          } as Session;
        } catch (error) {
          throw new Error(`Failed to sign in: ${error}`);
        }
      },
    }),
  };
}
