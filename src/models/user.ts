export interface User {
  id: number;
  authUserId: string;
  telegramId: number;
  telegramUsername: string;
  tonWalletAddress?: string;
  isPremium?: boolean;
}
export interface Session {
  user: User;
  accessToken: string;
}
