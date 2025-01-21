import { useMutation, useQuery } from '@tanstack/react-query';
import { Task, TaskType } from '../models/task.ts';
import { useTWASession } from '../contexts/TWASessionContext.tsx';
import axios from 'axios';

export function useTaskActions() {
  const { session, telegramInitData } = useTWASession();

  return {
    listTasks: () =>
      useQuery<Task[]>({
        queryKey: ['tasks.list'],
        queryFn: async () => {
          if (!session) {
            throw new Error('Session not set');
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_ENDPOINT}/rewardableTasks/listTasks`,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.accessToken}`,
                },
              },
            );
            return (
              (res.data?.map((data: any) => ({
                id: data.id,
                title: data.title,
                description: data.description,
                points: data.reward,
                type: data.type as TaskType,
                actionName: data.metadata?.actionName ?? '',
                link: data.metadata?.link ?? '',
                imageType: data.metadata?.imageType ?? '',
                completed: data.completed ?? false,
                timeToWait: data.metadata?.numWaitSeconds ?? null,
                taskStartedAt: data.taskStartedAt
                  ? new Date(data.taskStartedAt)
                  : null,
              })) as Task[]) ?? []
            );
          } catch (error) {
            throw new Error(`Failed to get referrals: ${error}`);
          }
        },
        enabled: !!session,
      }),
    checkTask: useMutation({
      mutationKey: ['tasks.check'],
      mutationFn: async (taskId: number) => {
        if (!session) {
          throw new Error('Session not set');
        }

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_ENDPOINT}/rewardableTasks/checkTask`,
            {
              taskId,
              telegramInitData: telegramInitData,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
              },
            },
          );

          return {
            id: res.data.id,
            title: res.data.title,
            description: res.data.description,
            points: res.data.reward,
            type: res.data.type as TaskType,
            actionName: res.data.metadata?.actionName ?? '',
            link: res.data.metadata?.link ?? '',
            imageType: res.data.metadata?.imageType ?? '',
            completed: res.data.completed ?? false,
            timeToWait: res.data.metadata?.numWaitSeconds ?? null,
            taskStartedAt: res.data.taskStartedAt
              ? new Date(res.data.taskStartedAt)
              : null,
          } as Task;
        } catch (error: any) {
          console.log(error);
          if (error.response && error.response.status === 412) {
            return null;
          }
          throw new Error(`Failed to check task: ${error}`);
        }
      },
    }),
  };
}
