import { Post, PostComment, PostCreateDto } from './interfaces/post.interface';
import { PostService } from "./services/post.service";

export * from './store'
export {
  PostService,
  type Post,
  type PostComment,
  type PostCreateDto
}
