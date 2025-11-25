import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, QueryList, Renderer2,
  signal, TemplateRef, ViewChild,
  viewChild, ViewChildren, viewChildren, ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantCardComponent } from '../participant-card/participant-card.component';

const initialState = [
  {
    name: 'Iriska',
    role: 'Angular-developer',
    isProgrammer: true,
    about: 'Some description about'
  },
  {
    name: 'Sergio',
    role: 'React-developer',
    isProgrammer: true,
    about: 'Some description about'
  },
]

@Component({
  selector: 'tt-dynamic-content-sandbox',
  imports: [CommonModule, ReactiveFormsModule, ParticipantCardComponent],
  templateUrl: './dynamic-content-sandbox.component.html',
  styleUrl: './dynamic-content-sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicContentSandboxComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  #r2 = inject(Renderer2);

  participantForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    role: this.fb.nonNullable.control('', [Validators.required]),
    about: this.fb.nonNullable.control('', [Validators.required]),
    isProgrammer: this.fb.nonNullable.control(false, [Validators.required]),
  });

  h2Element = viewChild<ElementRef>('h2');
  // @ViewChild('h2') h2Element!: ElementRef;

  cards = viewChild<ParticipantCardComponent>('card');
  @ViewChildren('card') cards2!: QueryList<ParticipantCardComponent>;

  templ = viewChild('partTempl', { read: TemplateRef });
  container = viewChild('container', { read: ViewContainerRef });

  participants = signal<{ name: string; role: string; about: string; isProgrammer: boolean }[]>(initialState);

  addParticipant() {
    if (this.participantForm.invalid) return;

    const newParticipant = this.participantForm.getRawValue();
    this.participants.update((current) => [...current, newParticipant]);

    this.participantForm.reset();
  }

  ngAfterViewInit() {
    console.log(this.h2Element()?.nativeElement);
    const template = this.templ();
    const container = this.container();

    if (!template || !container) return;
    this.participants().forEach((p) => {
      container.createEmbeddedView(template, { $implicit: p });
    });
  }
}
