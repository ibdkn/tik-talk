import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DndDirective, SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DndDirective, ReactiveFormsModule, FormsModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/images/avatar-placeholder.png');

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file: File | undefined = (event.target as HTMLInputElement)
      ?.files?.[0];

    if (!file || !file.type.match('image')) return;

    this.processFile(file);
  }

  onFileDropped(file: File): void {
    this.processFile(file);
  }

  processFile(file: File | null | undefined): void {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
