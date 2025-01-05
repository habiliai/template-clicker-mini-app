import { createLazyFileRoute, Link } from '@tanstack/react-router';
import MyLayout from '../components/MyLayout.tsx';
import { coin } from '../images';
import useTaskStore from '../store/task.ts';
import { formatNumber } from '../utils/text.ts';
import { Arrow } from '../icons/icons.tsx';
import { getTaskImage } from '../utils/image.ts';

// @ts-ignore
export const Route = createLazyFileRoute('/earn')({
  component: Page,
});

function Page() {
  const { tasks } = useTaskStore();
  return (
    <MyLayout>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="absolute inset-0 top-1/2 z-0 bg-gradient-secondary"></div>
        <div className="z-10 flex h-full w-full flex-1 flex-col items-center gap-y-2 overflow-y-auto p-4">
          <div className="mt-12 flex items-center font-bold">
            <img src={coin} width={100} height={100} />
          </div>
          <div className="mt-4 text-3xl font-semibold">Earn more coins</div>
          <Link to="/" className="mt-4 text-primary">
            Back to game
          </Link>
          <div className="mt-4 w-full text-lg font-semibold">Task lists</div>
          <div className="mt-2 flex w-full flex-col rounded-xl bg-white bg-opacity-10 p-1">
            {tasks.map((task) => (
              <Link
                key={task.id}
                className="flex w-full items-center justify-between rounded-lg p-4"
                to={`/tasks/${task.id}`}
              >
                <div className="flex w-full items-center gap-x-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20 p-2">
                    <img
                      src={getTaskImage(task)}
                      alt="Exchange"
                      className="object-fit w-full"
                    />
                  </div>
                  <div className="ml-2 flex flex-1 flex-col">
                    <span className="text-left">{task.title}</span>
                    <span className="flex items-center justify-start gap-x-1 text-sm font-normal text-gray-400">
                      +{formatNumber(task.points)}{' '}
                      <img src={coin} width={16} height={16} />
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Arrow size={24} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MyLayout>
  );
}
