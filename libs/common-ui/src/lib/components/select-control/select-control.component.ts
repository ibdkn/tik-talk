import {
  ChangeDetectionStrategy,
  Component, ElementRef, forwardRef,
  HostListener,
  Input, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { BehaviorSubject } from 'rxjs';
import { CommunityTheme } from '@tt/data-access';

@Component({
  selector: 'tt-select-control',
  imports: [CommonModule, FormsModule, SvgIconComponent],
  templateUrl: './select-control.component.html',
  styleUrl: './select-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectControlComponent),
    },
  ],
})
export class SelectControlComponent implements ControlValueAccessor {
  @Input() labelText!: string;
  @Input() placeholder!: string;
  @Input() icon?: string;

  @ViewChild('wrapper', { static: true }) wrapperRef!: ElementRef<HTMLElement>;
  @ViewChild('optionsList', { static: true }) optionsRef!: ElementRef<HTMLElement>;

  selectOptions: CommunityTheme[] = Object.values(CommunityTheme);
  value$ = new BehaviorSubject<string[]>([]);
  isOpen = false;

  isSelected = (opt: string) => this.value$.value.includes(opt);

  open(): void {
    this.isOpen = true;
  }
  close(): void {
    this.isOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(e: KeyboardEvent): void {
    e.stopPropagation();
    if (!this.isOpen) return;
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.isOpen) return;
    const target = e.target as Node;
    const wrapperEl = this.wrapperRef?.nativeElement;
    const optionsEl = this.optionsRef?.nativeElement;
    if (wrapperEl?.contains(target) || optionsEl?.contains(target)) return;
    this.close();
  }

  onToggleOption(opt: string): void {
    const curr = this.value$.value;
    const next = this.isSelected(opt)
      ? curr.filter(v => v !== opt)
      : [...curr, opt];

    this.value$.next(next);
    this.onChange([...next]);
    this.onTouched();
  }

  onDelete(i: number): void {
    const next = this.value$.value.filter((_, idx) => idx !== i);
    this.value$.next(next);
    this.onChange([...next]);
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(themes: string[] | null): void {
    if (!themes) {
      this.value$.next([]);
      return;
    }

    this.value$.next(themes);
  }
  setDisabledState?(isDisabled: boolean): void {}

  onChange(value: string[] | null) {}

  onTouched() {}
}
