import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TWASessionProvider } from '../contexts/TWASessionContext.tsx';
import { ToastProvider } from '../contexts/ToastContext.tsx';
import { GameProvider } from '../contexts/GameContext.tsx';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <React.Fragment>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <TWASessionProvider>
            <GameProvider>
              <Outlet />
            </GameProvider>
          </TWASessionProvider>
        </QueryClientProvider>
      </ToastProvider>
    </React.Fragment>
  );
}
