import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tt-textarea',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextareaComponent),
    },
  ],
})
export class TextareaComponent {
  labelText = input.required<string>();
  placeholder = input.required<string>();

  value = '';

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
