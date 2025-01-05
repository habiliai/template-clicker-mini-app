import { createFileRoute, Link } from '@tanstack/react-router';
import useTaskStore from '../../store/task.ts';
import { coin } from '../../images';
import MyLayout from '../../components/MyLayout.tsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatNumber } from '../../utils/text.ts';
import { getTaskImage } from '../../utils/image.ts';
import classNames from 'classnames';
import { useGameContext } from '../../contexts/GameContext.tsx';

export const Route = createFileRoute('/tasks/$taskId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();
  const { tasks, checkTask } = useTaskStore();
  const [isLoading] = useState(false);
  const { refetch: refetchGameContext } = useGameContext();

  const task = useMemo(() => {
    if (!tasks || !taskId) return null;
    return tasks.find((task) => task.id === parseInt(taskId));
  }, [tasks, taskId]);

  const isWatching = useMemo(() => {
    if (!task) return false;
    return !!(task.type === 'VISIT' && task.taskStartedAt);
  }, [task]);

  const getTimeRemaining = useCallback(() => {
    if (!task || !task.taskStartedAt || !task.timeToWait) return null;
    const timeToWaitMs = task.timeToWait * 1000;
    const now = new Date();
    const elapsedTime = now.getTime() - task.taskStartedAt.getTime();
    return Math.max(timeToWaitMs - elapsedTime, 0);
  }, [task]);

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  const handleCheck = useCallback(async () => {
    if (!task) return;
    await checkTask(task.id);
    refetchGameContext();
  }, [checkTask, task]);

  useEffect(() => {
    if (!isWatching) return;
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isWatching]);
  return (
    <MyLayout>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="bg-gradient-secondary absolute inset-0 top-1/2 z-0"></div>
        <div className="z-10 flex h-full w-full flex-1 flex-col items-center gap-y-2 overflow-y-auto p-4">
          <div className="mt-12 flex items-center font-bold">
            <img src={coin} width={100} height={100} />
          </div>
          <div className="mt-4 text-center text-3xl font-semibold">
            {task?.title}
          </div>
          <Link to="/earn" className="text-primary mt-4">
            Back to list
          </Link>
          {task && (
            <div className="mt-4 flex w-full flex-1 flex-col justify-between rounded-xl bg-white bg-opacity-10 p-4 pb-10">
              <div className="flex w-full flex-1 flex-col gap-y-4">
                <img
                  src={getTaskImage(task)}
                  alt={task.title}
                  className="mx-auto h-20 w-20"
                />
                <div className="flex justify-center">
                  <button
                    className="w-fit rounded-2xl bg-blue-500 px-6 py-3 text-xl font-bold text-white"
                    onClick={() => {
                      if (task.type === 'VISIT' && task.link) {
                        checkTask(task.id);
                        window.open(task.link, '_blank');
                      }
                    }}
                  >
                    {task.actionName}
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <img src={coin} className="h-6 w-6" />
                  <span className="ml-1 text-2xl font-bold text-white">
                    +{formatNumber(task.points)}
                  </span>
                </div>
                <p className="mb-4 flex flex-1 overflow-y-auto rounded-xl bg-white bg-opacity-5 p-4 text-center text-gray-400">
                  {task.description}
                </p>
              </div>
              {task.type === 'VISIT' ? (
                <button
                  className={classNames(
                    'flex w-full items-center justify-center rounded-2xl py-6 text-xl font-bold text-white',
                    {
                      'bg-gray-600': task.completed,
                      'bg-green-500': !task.completed,
                    },
                  )}
                  onClick={handleCheck}
                  disabled={isLoading || !isWatching || task.completed}
                >
                  {isLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-solid border-white"></div>
                  ) : task.completed ? (
                    'Completed'
                  ) : task.taskStartedAt ? (
                    !timeRemaining ? (
                      'Check'
                    ) : (
                      formatTime(timeRemaining || 0)
                    )
                  ) : (
                    'Start task with watching'
                  )}
                </button>
              ) : (
                <button
                  className={classNames(
                    'flex w-full items-center justify-center rounded-2xl py-6 text-xl font-bold text-white',
                    {
                      'bg-gray-600': task.completed,
                      'bg-green-500': !task.completed,
                    },
                  )}
                  onClick={handleCheck}
                  disabled={isLoading || task.completed}
                >
                  {isLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-solid border-white"></div>
                  ) : task.completed ? (
                    'Completed'
                  ) : (
                    'Check'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MyLayout>
  );
}
