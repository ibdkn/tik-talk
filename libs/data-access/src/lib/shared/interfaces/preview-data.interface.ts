export interface PreviewCardData {
  id: number;
  avatarUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags: string[];
  primaryLabel?: string;
  icon: string;
  secondaryLink?: string;
  isJoined: boolean;
  isMine: boolean
}
