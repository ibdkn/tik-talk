import { ChangeDetectionStrategy, Component, forwardRef, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from '@tt/common-ui';

@Component({
  selector: 'tt-emoji-textarea',
  imports: [CommonModule, ReactiveFormsModule, SvgIconComponent, FormsModule],
  templateUrl: './emoji-textarea.component.html',
  styleUrl: './emoji-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmojiTextareaComponent),
      multi: true,
    },
  ],
})
export class EmojiTextareaComponent implements ControlValueAccessor {
  r2: Renderer2 = inject(Renderer2);

  value: string = '';

  onTextAreaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string) {
    this.value = value ?? '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onInput(value: string) {
    this.value = value;
    this.onChange(value);
  }
}
