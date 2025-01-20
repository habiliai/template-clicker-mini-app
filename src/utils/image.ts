import { Task } from '../models/task.ts';
import { friends, telegram, twitter, youtube } from '../images';

export function getTaskImage(task: Task) {
  switch (task.imageType) {
    case 'TELEGRAM':
      return telegram;
    case 'YOUTUBE':
      return youtube;
    case 'TWITTER':
      return twitter;
    case 'FRIENDS':
      return friends;
    default:
      return '';
  }
}
