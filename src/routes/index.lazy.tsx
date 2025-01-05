import { createLazyFileRoute, Link } from '@tanstack/react-router';
import MyLayout from '../components/MyLayout.tsx';
import { Arrow, LoadingCircle } from '../icons/icons.tsx';
import { bear, coin, highVoltage, nut, rocket } from '../images';
import { useCallback, useState } from 'react';
import useGameStore from '../store/game.ts';
import { useToast } from '../contexts/ToastContext.tsx';
import { useGameContext } from '../contexts/GameContext.tsx';

// @ts-ignore
export const Route = createLazyFileRoute('/')({
  component: Page,
});

function Page() {
  const { showError } = useToast();
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const { synchronized } = useGameContext();
  const [isPressed, setIsPressed] = useState(false);
  const { userGameContext, earnPoints, points, energy } = useGameStore();
  const handleMouseDown = useCallback(() => setIsPressed(true), []);
  const handleMouseUp = useCallback(() => setIsPressed(false), []);

  const handleClickNut = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!userGameContext) {
        showError('User game context not found');
        return;
      }
      const numPoints = userGameContext.pointEarnsPerClick;
      const numEnergy = userGameContext.energyConsumesPerClick;
      if (earnPoints(numPoints, numEnergy)) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setClicks([...clicks, { id: Date.now(), x, y }]);
      }
    },
    [userGameContext, earnPoints],
  );

  const handleAnimationEnd = useCallback(
    (id: number) => {
      setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
    },
    [setClicks],
  );

  return (
    <MyLayout>
      <div className="relative flex min-h-screen flex-col items-center bg-gradient-main px-4 font-medium text-white">
        <div className="absolute inset-0 z-0 h-1/2 bg-gradient-overlay"></div>
        <div className="absolute inset-0 z-0 bg-radial-gradient-overlay"></div>
        <div className="z-10 flex min-h-screen w-full flex-col items-center text-white">
          <div className="absolute left-0 top-0 z-10 flex w-full flex-col items-center px-4 pt-8 text-white">
            <a
              className="w-full"
              href={import.meta.env.VITE_TELEGRAM_CHANNEL}
              target={'_blank'}
              rel={'noreferrer'}
            >
              <div className="rounded-xl bg-[#1f1f1f] py-2 text-center">
                <p className="text-lg">
                  Join channel{' '}
                  <Arrow size={18} className="mb-1 ml-0 inline-block" />
                </p>
              </div>
            </a>
            <div className="relative mt-12 flex w-full items-center justify-center text-5xl font-bold">
              <img src={coin} width={44} height={44} />
              <span className="ml-2">{points.toLocaleString()}</span>
              {!synchronized && (
                <div className="absolute left-4 top-4">
                  <LoadingCircle color="#FFB600" />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center text-base">
              <span className="ml-1">
                {userGameContext?.levelName}
                <Arrow size={18} className="mb-1 ml-0 inline-block" />
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 z-10 w-full px-4 pb-4">
            <div className="flex w-full justify-between gap-2">
              <div className="flex w-1/3 max-w-32 items-center justify-start">
                <div className="flex items-center justify-center">
                  <img
                    src={highVoltage}
                    width={44}
                    height={44}
                    alt="High Voltage"
                  />
                  <div className="ml-2 text-left">
                    <span className="block text-2xl font-bold text-white">
                      {energy}
                    </span>
                    <span className="text-large text-white opacity-75">
                      / {userGameContext?.energyLimit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex max-w-60 flex-grow items-center text-sm">
                <div className="flex w-full justify-around rounded-2xl bg-[#fad258] py-4">
                  <Link
                    className="flex flex-col items-center gap-1"
                    to="/frens"
                  >
                    <img src={bear} width={24} height={24} alt="High Voltage" />
                    <span>Frens</span>
                  </Link>
                  <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                  <Link className="flex flex-col items-center gap-1" to="/earn">
                    <img src={coin} width={24} height={24} alt="High Voltage" />
                    <span>Earn</span>
                  </Link>
                  <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                  <Link
                    className="flex flex-col items-center gap-1"
                    to="/boosts"
                  >
                    <img
                      src={rocket}
                      width={24}
                      height={24}
                      alt="High Voltage"
                    />
                    <span>Boosts</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full rounded-full bg-[#f9c035]">
              {userGameContext && (
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-[#f3c45a] to-[#fffad0]"
                  style={{
                    width: `${(energy / userGameContext.energyLimit) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex flex-grow items-center justify-center">
            <div
              className="relative mt-4"
              onClick={handleClickNut}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            >
              <img
                src={nut}
                width={256}
                height={256}
                alt="nutcoin"
                style={{
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transform: isPressed ? 'translateY(4px)' : 'translateY(0px)',
                  transition: 'transform 100ms ease',
                }}
              />
              {clicks.map((click) => (
                <div
                  key={click.id}
                  className="pointer-events-none absolute flex transform animate-float items-end justify-center text-4xl font-bold text-white opacity-0"
                  style={{
                    top: `${click.y - 42}px`,
                    left: `${click.x - 28}px`,
                  }}
                  onAnimationEnd={() => handleAnimationEnd(click.id)}
                >
                  +{userGameContext?.pointEarnsPerClick}{' '}
                  <span className="text-xl">🐿</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MyLayout>
  );
}
