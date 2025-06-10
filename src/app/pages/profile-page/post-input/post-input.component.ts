import {Component, EventEmitter, HostBinding, inject, input, InputSignal, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ProfileService} from '../../../data/services/profile.service';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {PostService} from '../../../data/services/post.service';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-post-input',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  profile = inject(ProfileService).me;
  postService: PostService = inject(PostService);

  postText: string = '';
  isCommentInput: InputSignal<boolean> = input(false);
  postId: InputSignal<number> = input<number>(0);

  @Output() created = new EventEmitter();

  @HostBinding('class.comment')
  get isComment(): boolean {
    return this.isCommentInput()
  }

  onCreatedPost(): void {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      firstValueFrom(
        this.postService.createComments({
          text: this.postText,
          authorId: this.profile()!.id,
          postId: this.postId()
        })
      ).then(() => {
        this.postText = '';
        this.created.emit();
      })

      return;
    }

    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: this.postText,
        authorId: this.profile()!.id
      })
    ).then(() => {
      this.postText = '';
    })
  }

  onTextAreaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }
}
