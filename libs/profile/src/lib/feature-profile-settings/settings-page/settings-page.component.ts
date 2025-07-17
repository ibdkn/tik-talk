import {ChangeDetectionStrategy, Component, effect, inject, ViewChild} from '@angular/core';
import {ProfileHeaderComponent} from '../../ui/profile-header/profile-header.component';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {AvatarUploadComponent} from '../../ui/avatar-upload/avatar-upload.component';
import {ProfileService} from '@tt/profile';
import {SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    AvatarUploadComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  fb: FormBuilder = inject(FormBuilder);
  profileService: ProfileService = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack),
      });
    });
  }

  onSave(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
    );
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];

    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined): string {
    if (!stack) return '';

    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }
}
