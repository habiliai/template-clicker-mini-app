import { Session } from '../models/user.ts';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTwaAuthActions } from '../actions/auth.ts';
import { useToast } from './ToastContext.tsx';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const TWASessionContext = createContext<{
  session: Session | null;
  telegramInitData: string;
}>({
  session: null,
  telegramInitData: '',
});

export function TWASessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signIn } = useTwaAuthActions();
  const [session, setSession] = useState<Session | null>(null);
  const [telegramInitData, setTelegramInitData] = useState('');
  const { showSuccess, showError } = useToast();
  const [startParam, setStartParam] = useState('');

  const joinFromReferral = useMutation({
    mutationKey: ['users.joinFromReferral'],
    mutationFn: async ({
      referrerUserId,
      referredUsername,
    }: {
      referredUsername: string;
      referrerUserId: string;
    }) => {
      if (!session) {
        throw new Error('Session not set');
      }

      try {
        await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/referrals/acceptReferral`,
          {
            referredUsername,
            referrerUserId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          },
        );
      } catch (error) {
        throw new Error(`Failed to join from referral: ${error}`);
      }
    },
  });

  const loadTelegramInitData = useCallback(async () => {
    if (import.meta.env.VITE_BYPASS_TELEGRAM_AUTH === 'true') {
      // This is a sample telegramInitData generated with TELEGRAM_BOT_TOKEN
      setTelegramInitData(
        'user=%7B%22id%22%3A%22user-identifier%22%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22abctest1234%22%2C%22is_premium%22%3Atrue%7D&auth_date=1733356805&hash=37069ab3b9ec3d955570d329040be4c370cb459d1bfe820337b43c961f5b6952',
      );
      // setStartParam('91822428-10bd-4836-a2d6-dce045bf4a03');
      return;
    }
    if (typeof window !== 'undefined') {
      const WebApp = (await import('@twa-dev/sdk')).default;
      WebApp.ready();
      const initData = WebApp.initDataUnsafe;
      setStartParam(WebApp.initDataUnsafe.start_param ?? '');
      if (initData?.user) {
        setTelegramInitData(WebApp.initData);
      } else {
        showError('Failed to load telegramInitData');
      }
    }
  }, []);

  useEffect(() => {
    if (!telegramInitData) return;
    (async () => {
      try {
        const session = await signIn.mutateAsync({
          telegramInitData,
        });
        setSession(session);
        showSuccess('Successfully signed in with Telegram');
      } catch (error) {
        console.error(error);
        showError('Failed to sign in with Telegram');
      }
    })();
  }, [telegramInitData]);

  useEffect(() => {
    if (!session || !startParam) return;

    const debounce = setTimeout(async () => {
      try {
        await joinFromReferral.mutateAsync({
          referrerUserId: startParam,
          referredUsername: session.user.telegramUsername,
        });
      } catch (error) {
        console.error(error);
        showError('Failed to join from referral');
      }
    }, 1000);

    return () => {
      clearTimeout(debounce);
    };
  }, [session, startParam]);

  useEffect(() => {
    if (session) return;

    const debounceTimer = setTimeout(async () => {
      await loadTelegramInitData();
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  return (
    <TWASessionContext.Provider
      value={{
        session,
        telegramInitData,
      }}
    >
      {children}
    </TWASessionContext.Provider>
  );
}

export function useTWASession() {
  const context = useContext(TWASessionContext);
  if (!context) {
    throw new Error('useSession must be used within a TWASessionProvider');
  }
  return context;
}
