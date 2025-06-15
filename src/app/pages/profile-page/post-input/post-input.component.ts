import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  InputSignal,
  Output,
  Renderer2,
} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {FormsModule} from '@angular/forms';
import {Profile} from '../../../data/interfaces/profile.interface';

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
  r2: Renderer2 = inject(Renderer2);

  postText: string = '';
  //@ts-ignore
  profile: InputSignal<Profile | null> = input<Profile>();
  isCommentInput: InputSignal<boolean> = input(false);
  postId: InputSignal<number> = input<number>(0);

  @Output() created: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.comment')
  get isComment(): boolean {
    return this.isCommentInput()
  }

  onCreated(): void {
    const text: string = this.postText.trim();

    if (!text) return;

    this.created.emit(this.postText);
    this.postText = '';
  }

  onTextAreaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }
}
