import { Profile } from '../../profile/interfaces/profile.interface';
import { FormControl } from '@angular/forms';

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

export interface CommunityCreateDto {
  name: string,
  themes: string[] | null,
  tags: string[] | null,
  description: string | null
}

export interface CommunityUpdateDto extends CommunityCreateDto {}

export interface CommunityForm {
  name: FormControl<string>,
  themes: FormControl<string[] | null>,
  tags: FormControl<string[] | null>,
  description: FormControl<string | null>
}
