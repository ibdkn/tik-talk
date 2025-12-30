import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmojiTextareaComponent,
  ModalBaseComponent,
  ModalService,
  ProfileSelectorComponent,
  RadioComponent,
  SvgIconComponent
} from '@tt/common-ui';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChatService,
  Community,
  GlobalStoreService,
  postActions,
  PostCreateDto, Profile, ProfileService
} from '@tt/data-access';
import { catchError, EMPTY, from, mergeMap, toArray } from 'rxjs';

@Component({
  selector: 'tt-community-share-modal',
  imports: [
    CommonModule,
    ModalBaseComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    RadioComponent,
    ProfileSelectorComponent,
    EmojiTextareaComponent,
  ],
  templateUrl: './community-share-modal.component.html',
  styleUrl: './community-share-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityShareModalComponent implements OnInit {
  store = inject(Store);
  #modalService = inject(ModalService);
  profileService = inject(ProfileService);
  chatService = inject(ChatService);
  me = inject(GlobalStoreService).me;

  community: InputSignal<Community | null> = input<Community | null>(null);
  subscribers = toSignal(this.profileService.getSubscribers(), {
    initialValue: [] as Profile[],
  });

  options = [
    { label: 'На своей странице', value: 'posts-wall' },
    { label: 'В личном сообщении', value: 'direct-message' },
  ];

  form = new FormGroup({
    type: new FormControl<'posts-wall' | 'direct-message'>('posts-wall'),
    message: new FormControl('', { nonNullable: true }),
    subscriberIds: new FormControl<number[]>([], { nonNullable: true }),
  });

  typeSignal = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  isDirectMessage = computed(() => this.typeSignal() === 'direct-message');

  ngOnInit() {
    const recipients = this.form.controls.subscriberIds;

    const requiredArrayValidator = (control: any) =>
      Array.isArray(control.value) && control.value.length > 0
        ? null
        : { required: true };

    this.form.controls.type.valueChanges.subscribe((type) => {
      if (type === 'direct-message') {
        recipients.setValidators([requiredArrayValidator]);
      } else {
        recipients.clearValidators();
        recipients.setValue([]);
      }

      recipients.updateValueAndValidity({ emitEvent: false });
    });

    this.form.controls.type.updateValueAndValidity({ emitEvent: true });
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { type, message, subscriberIds } = this.form.getRawValue();
    const textMessage = message.trim();

    const community = this.community();
    const communityLink = community
      ? `[${community.name}](/community/${community.id})`
      : '';

    const content = communityLink
      ? textMessage
        ? `${textMessage}\n\n${communityLink}`
        : communityLink
      : textMessage;

    if (!content) return;

    if (type === 'direct-message') {
      if (!subscriberIds.length) return;

      from(subscriberIds)
        .pipe(
          mergeMap(
            (subscriberId) =>
              this.chatService.createChat(subscriberId).pipe(
                mergeMap((chat) =>
                  this.chatService.sendMessage(chat.id, content)
                ),
                catchError(() => EMPTY)
              ),
            3
          ),
          toArray()
        )
        .subscribe(() => this.hide());

      return;
    }

    if (type === 'posts-wall') {
      const dto: PostCreateDto = {
        title: 'Приглашение в сообщество',
        content,
        authorId: this.me()?.id,
      };

      this.store.dispatch(postActions.createPost({ post: dto }));
      this.hide();
      return;
    }
  }

  hide() {
    this.#modalService.hide();
  }
}
