export type TaskType = 'VISIT' | 'JOIN_TELEGRAM_CHANNEL' | 'REFERRAL';
export type ImageCategory = 'FRIENDS' | 'TELEGRAM' | 'YOUTUBE' | 'TWITTER';
export interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  type: TaskType;
  actionName: string;
  link: string;
  imageType: ImageCategory;
  completed: boolean;
  taskStartedAt: Date | null;
  timeToWait: number | null;
}
