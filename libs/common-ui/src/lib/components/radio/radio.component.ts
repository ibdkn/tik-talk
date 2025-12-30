import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

let radioGroupId = 0;

@Component({
  selector: 'tt-radio',
  imports: [CommonModule, FormsModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  options = input.required<{ label: string; value: string }[]>();

  value = '';
  disabled = false;
  groupName = `tt-radio-group-${++radioGroupId}`;

  onChange = (value: string) => {};
  onTouched = () => {};

  select(nextValue: string): void {
    if (this.disabled) return;

    this.value = nextValue;
    this.onChange(nextValue);
    this.onTouched();
  }

  writeValue(value: string) {
    this.value = value ?? '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
