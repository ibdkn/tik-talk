import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  computed, DestroyRef, inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgUrlPipe } from '../../pipes';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Profile } from '@tt/data-access';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'tt-profile-selector',
  imports: [CommonModule, ImgUrlPipe, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSelectorComponent implements ControlValueAccessor {
  readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly formGroupDir = inject(FormGroupDirective, { optional: true });
  private readonly ngForm = inject(NgForm, { optional: true });
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);

  labelText = input.required<string>();
  placeholder = input.required<string>();
  subscribers = input<Profile[]>([]);

  query = signal('');
  selectedIds = signal<number[]>([]);
  disabled = signal(false);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    const sub = (this.formGroupDir?.ngSubmit ?? this.ngForm?.ngSubmit ?? EMPTY)
      .subscribe(() => this.cdr.markForCheck());

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  filteredSubscribers = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.subscribers();

    if (!q) {
      return list;
    }

    return list.filter((p) => {
      const first = (p.firstName ?? '').toLowerCase();
      const last = (p.lastName ?? '').toLowerCase();
      return `${first} ${last}`.includes(q);
    });
  });

  onChange: (value: number[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number[] | null): void {
    this.selectedIds.set(value ?? []);
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.query.set(value);
  }

  toggle(profileId: number): void {
    if (this.disabled()) return;

    const current = this.selectedIds();
    const next = current.includes(profileId) ? current.filter((id) => id !== profileId) : [...current, profileId];

    this.selectedIds.set(next);
    this.onChange(next);
    this.onTouched();
  }

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }
}
