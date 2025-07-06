import {
  Component, computed,
  EventEmitter,
  HostBinding,
  inject,
  input,
  InputSignal, OnInit,
  Output,
  Renderer2, Signal, WritableSignal,
} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {FormsModule} from '@angular/forms';
import {Profile} from '../../../data/interfaces/profile.interface';
import {ProfileService} from '../../../data/services/profile.service';

@Component({
  selector: 'app-common-input',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent implements OnInit {
  r2: Renderer2 = inject(Renderer2);
  me: WritableSignal<Profile | null> = inject(ProfileService).me;

  text: string = '';
  //@ts-ignore
  profile: InputSignal<Profile | null | undefined> = input<Profile>();
  isCommentInput: InputSignal<boolean> = input(false);
  isEditableInput: InputSignal<boolean> = input(false);
  isChatInput: InputSignal<boolean> = input(false);
  postId: InputSignal<number> = input<number>(0);
  content: InputSignal<string> = input<string>('');

  @Output() created: EventEmitter<string> = new EventEmitter<string>();
  @Output() saved: EventEmitter<string> = new EventEmitter<string>();
  @Output() canceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding('class.comment')
  get isComment(): boolean {
    return this.isCommentInput()
  }

  @HostBinding('class.editable')
  get isEditable(): boolean {
    return this.isEditableInput()
  }

  currentProfile: Signal<Profile | null | undefined> = computed(() => this.isChatInput() ? this.me() : this.profile());

  ngOnInit(): void {
    if (this.content()) {
      this.text = this.content();
    }
  }

  onCreated(): void {
    const text: string = this.text.trim();
    if (!text) return;
    this.created.emit(this.text);
    this.text = '';
  }

  onSaved(): void {
    const text: string = this.text.trim();
    if (!text) return;
    this.saved.emit(this.text);
    this.canceled.emit(false);
  }

  onCanceled(): void {
    this.canceled.emit(false);
  }

  onTextAreaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }
}
