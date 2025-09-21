import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NoReactValidator} from '../directives/no-react.validator';

@Component({
  selector: 'tt-trips',
  imports: [CommonModule, FormsModule, NoReactValidator],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
})
export class TripsComponent {
  username = '';

  onChange(value: string) {
    console.log(value)
    this.username = value;
  }

  onSubmit(event: SubmitEvent) {
    console.log(event.target);
    //@ts-ignore
    console.log(window.ng.getDirectives(event.target))
  }
}
