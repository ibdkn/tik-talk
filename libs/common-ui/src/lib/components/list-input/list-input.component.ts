import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  forwardRef,
  HostListener,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tt-list-input',
  imports: [CommonModule, SvgIconComponent, FormsModule],
  templateUrl: './list-input.component.html',
  styleUrl: './list-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ListInputComponent),
    },
  ],
})
export class ListInputComponent implements ControlValueAccessor {
  labelText = input.required<string>();
  placeholder = input.required<string>();
  icon = contentChild('[icon]', { read: ElementRef });

  value$ = new BehaviorSubject<string[]>([]);
  innerInput = '';

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.innerInput) return;

    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value$.value);
  }

  onDelete(i: number) {
    const next = this.value$.value.filter((_, idx) => idx !== i);
    this.value$.next(next);
    this.onChange(this.value$.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.value$.next([]);
      return;
    }

    this.value$.next(stack);
  }

  setDisabledState?(isDisabled: boolean): void {}

  onChange(value: string[] | null) {}

  onTouched() {}
}
