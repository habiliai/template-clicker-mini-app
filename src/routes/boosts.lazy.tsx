import { createLazyFileRoute, Link } from '@tanstack/react-router';
import MyLayout from '../components/MyLayout.tsx';
import { coin, highVoltage, battery, squirrel } from '../images';
import { formatNumber } from '../utils/text.ts';
import useBoosterStore from '../store/booster.ts';
import classNames from 'classnames';
import useGameStore from '../store/game.ts';
import { useToast } from '../contexts/ToastContext.tsx';
import { useGameContext } from '../contexts/GameContext.tsx';
// @ts-ignore
export const Route = createLazyFileRoute('/boosts')({
  component: Page,
});

function Page() {
  const { points } = useGameStore();
  return (
    <MyLayout>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="bg-gradient-secondary absolute inset-0 top-1/2 z-0"></div>
        <div className="z-10 flex h-full w-full flex-1 flex-col items-center gap-y-2 overflow-y-auto p-4">
          <div className="mt-12 text-gray-100">Your balance</div>
          <div className="flex items-center text-5xl font-bold">
            <img src={coin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <DailyBoosters className="flex w-full flex-col" />
          <Boosters className="mt-4 flex w-full flex-col" />
          <Link to="/" className="text-primary mt-4">
            Back to game
          </Link>
        </div>
      </div>
    </MyLayout>
  );
}

function DailyBoosters({ className }: { className?: string }) {
  const { energy, userGameContext } = useGameStore();
  const { dailyBoosters, refillDailyBooster } = useBoosterStore();

  return (
    <div className={className}>
      <div className="text-base">Free daily boosters</div>
      <div className="mt-4 flex flex-col gap-y-4">
        {userGameContext &&
          dailyBoosters.map((booster) => (
            <button
              key={booster.id}
              className="flex w-full items-center justify-between rounded-lg bg-[#272a2f] p-4"
              onClick={() => refillDailyBooster(booster.id)}
              disabled={
                booster.remainingAmount <= 0 ||
                energy >= userGameContext.energyLimit
              }
            >
              <div className="flex items-center">
                <img src={highVoltage} alt="Exchange" className="h-10 w-10" />
                <div className="ml-2 flex flex-col">
                  <span className="text-left font-medium">{booster.title}</span>
                  <span className="font-normal text-gray-500">
                    {booster.remainingAmount}/{booster.maxAmount} available
                  </span>
                </div>
              </div>
              {/*{isLoadingRefill ? (*/}
              {/*  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>*/}
              {/*) : timeRemaining !== null && timeRemaining > 0 ? (*/}
              {/*  <div className="flex items-center">*/}
              {/*    <Time className="mr-1 h-4 w-4 text-yellow-500" />*/}
              {/*    <span className="text-yellow-500">*/}
              {/*      formatTime(timeRemaining)*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*) : (*/}
              {/*  <span className="text-primary font-semibold">Refill</span>*/}
              {/*)}*/}
              <span
                className={classNames('text-primary font-semibold', {
                  'opacity-50':
                    booster.remainingAmount <= 0 ||
                    energy >= userGameContext.energyLimit,
                })}
              >
                Refill
              </span>
            </button>
          ))}
      </div>
    </div>
  );
}

function Boosters({ className }: { className?: string }) {
  const { points } = useGameStore();
  const { boosters, upgradeBooster } = useBoosterStore();
  const { showSuccess, showError } = useToast();
  const { refetch: refetchGameContext } = useGameContext();
  return (
    <div className={className}>
      <div className="text-base">Boosters</div>
      <div className="mt-4 flex flex-col gap-y-4">
        {boosters.map((booster) => (
          <button
            key={booster.id}
            className="flex w-full items-center justify-between rounded-lg bg-[#272a2f] p-4"
            onClick={async () => {
              try {
                await upgradeBooster(booster.id);
                showSuccess('Booster upgraded');
                refetchGameContext();
              } catch (e) {
                console.error(e);
                showError("Can't upgrade booster");
              }
            }}
          >
            <div className="flex items-center">
              <img
                src={booster.type == 'MULTITAP' ? squirrel : battery}
                alt="type"
                className="h-10 w-10"
              />
              <div className="ml-2 flex flex-col">
                <div className="text-left font-medium">{booster.title}</div>
                <div className="flex items-center justify-center">
                  <span className="ml-1 text-gray-500">
                    <span
                      className={classNames('font-semibold', {
                        'text-red': points < booster.currentPrice,
                        'text-white': points >= booster.currentPrice,
                      })}
                    >
                      {formatNumber(booster.currentPrice)}
                    </span>{' '}
                    • {booster.currentLevel} lvl
                  </span>
                </div>
              </div>
            </div>
            <span
              className={classNames('text-primary font-semibold', {
                'opacity-50': points < booster.currentPrice,
              })}
            >
              Upgrade
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
