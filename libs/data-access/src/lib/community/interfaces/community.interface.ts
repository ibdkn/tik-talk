import { Profile } from '../../profile/interfaces/profile.interface';

export interface Community {
  id: number,
  admin: Profile,
  name: string,
  themes: string[],
  tags: string[],
  bannerUrl: string,
  avatarUrl: string,
  description: string,
  subscribersAmount: number,
  createdAt: string,
  isJoined: boolean
}
