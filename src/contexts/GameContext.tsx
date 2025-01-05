import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useToast } from './ToastContext.tsx';
import useGameStore from '../store/game.ts';
import { useGameActions } from '../actions/games.ts';
import useInterval from '../hooks/useInterval.ts';

const GameContext = createContext<{
  synchronized: boolean;
  refetch: () => void;
}>({
  synchronized: false,
  refetch: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { showSuccess, showError } = useToast();
  const [synchronized, setSynchronized] = useState(false);
  const { userGameContext, updateGameContext, points, energy, renewEnergy } =
    useGameStore();

  const { getGameContext, syncGameContext } = useGameActions();
  const { data: fetchedGameContext, refetch } = getGameContext();
  const { mutateAsync: syncGameContextToServer } = syncGameContext();

  useInterval(() => {
    if (!userGameContext) return;
    renewEnergy();
  }, userGameContext?.energyRefillInterval ?? null);

  const syncWithServer = useCallback(async () => {
    try {
      await syncGameContextToServer({
        pointsBalance: points,
        energyBalance: energy,
      });
      setSynchronized(true);
      showSuccess('Synced with server');
    } catch (error) {
      showError(`Sync failed: ${error}`);
    }
  }, [points, energy, synchronized]);

  useEffect(() => {
    if (!userGameContext) return;
    const debounce = setTimeout(() => {
      syncWithServer();
    }, 1000);
    return () => clearTimeout(debounce);
  }, [userGameContext, points]);

  useEffect(() => {
    if (!fetchedGameContext) return;
    updateGameContext(fetchedGameContext);
    showSuccess('Successfully fetched user game context');
  }, [fetchedGameContext]);

  return (
    <GameContext.Provider value={{ synchronized, refetch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
