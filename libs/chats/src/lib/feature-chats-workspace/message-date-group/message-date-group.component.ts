import {ChangeDetectionStrategy, Component, input, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-date-group',
  imports: [CommonModule],
  templateUrl: './message-date-group.component.html',
  styleUrl: './message-date-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageDateGroupComponent implements OnInit {
  messageData = input<string>();
  dateInfo = signal<string>('');

  ngOnInit() {
    const dateValue = this.messageData();
    if (!dateValue) return;

    const dateArr = dateValue.slice(0, 10).split('-');
    const now = new Date();

    const dateObj = {
      year: now.getFullYear().toString(),
      month:
        now.getMonth().toString().length === 1
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`,
      day: now.getDate().toString(),
    };

    const dateMesObj = {
      year: dateArr[0],
      month: dateArr[1],
      day: dateArr[2],
    };

    if (
      dateObj.year === dateMesObj.year &&
      dateObj.month === dateMesObj.month &&
      dateObj.day === dateMesObj.day
    ) {
      return this.dateInfo.set('Сегодня');
    } else if (
      dateObj.year === dateMesObj.year &&
      dateObj.month === dateMesObj.month &&
      dateObj.day === (Number(dateMesObj.day) + 1).toString()
    ) {
      return this.dateInfo.set('Вчера');
    }
    return this.dateInfo.set(
      `${dateMesObj.day}.${dateMesObj.month}.${dateMesObj.year}`
    );
  }
}
