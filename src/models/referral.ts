export interface ReferralBonusItem {
  id: number;
  title: string;
  description: string;
  points: number;
}

export interface ReferredUser {
  authUserId: string;
  username: string;
  joinedAt: Date;
  createdAt: Date;
}
