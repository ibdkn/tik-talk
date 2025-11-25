import { Community, Profile } from '@tt/data-access';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId?: number;
  communityId?: number;
}

export interface PostUpdateDto {
  title?: string;
  content: string;
}

export interface Post {
  id: number;
  title: string;
  communityId: number;
  content: string;
  author: Profile | Community;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: PostComment[];
}

export interface PostComment {
  id: number;
  text: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string;
    subscribersAmount: number;
  };
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateDto {
  text: string;
  authorId: number;
  postId: number;
  commentId?: number;
}
