export interface Profile {
  id: number;
  username: string;
  avatarUrl: string;
  subscribersAmount: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  stack: string[];
  city: string;
  description: string;
}

export interface SearchFilter {
  labelText: string,
  formControlName: string,
  placeholder: string,
  icon: string
}
