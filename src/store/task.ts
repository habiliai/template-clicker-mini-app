import { Task } from '../models/task.ts';
import { useTaskActions } from '../actions/tasks.ts';
import { useMemo } from 'react';
import { useToast } from '../contexts/ToastContext.tsx';

const useTaskStore = () => {
  const { listTasks, checkTask } = useTaskActions();
  const { showSuccess, showError } = useToast();
  const { data: taskList, refetch } = listTasks();
  const tasks = useMemo<Task[]>(() => taskList ?? [], [taskList]);
  return {
    tasks,
    checkTask: async (taskId: number) => {
      try {
        const task = await checkTask.mutateAsync(taskId);
        if (!task) {
          showError('Condition not met to complete the task!');
          return;
        }
        if (task.completed) {
          showSuccess('Task completed!');
        } else if (task.taskStartedAt) {
          showSuccess("Task is started, but it's not completed yet");
        }
        refetch();
      } catch (e) {
        console.error(e);
        showError("Error: Couldn't complete the task");
      }
    },
  };
};

export default useTaskStore;
