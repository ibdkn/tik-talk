import {Component, OnInit, output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tt-infinite-scroll-trigger',
  imports: [CommonModule],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.scss',
  standalone: true
})
export class InfiniteScrollTriggerComponent implements OnInit {
  loaded = output<void>();
  ngOnInit() {
    this.loaded.emit();
  }
}
