import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return null;

    // Преобразуем дату из ISO-строки в локальное время пользователя
    const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
    const now = DateTime.local();

    const diffSec = Math.floor(now.diff(date, 'seconds').seconds);

    // Меньше минуты
    if (diffSec < 60) {
      if (diffSec < 5) return 'только что';
      return `${diffSec} ${this.pluralize(diffSec, ['секунда', 'секунды', 'секунд'])} назад`;
    }

    const diffMin = Math.floor(now.diff(date, 'minutes').minutes);

    // Меньше часа
    if (diffMin < 60) {
      return `${diffMin} ${this.pluralize(diffMin, ['минута', 'минуты', 'минут'])} назад`;
    }

    const diffHours = Math.floor(now.diff(date, 'hours').hours);
    const remMin = diffMin % 60;

    // Часы и минуты
    let result = `${diffHours} ${this.pluralize(diffHours, ['час', 'часа', 'часов'])}`;
    if (remMin > 0) {
      result += ` ${remMin} ${this.pluralize(remMin, ['минута', 'минуты', 'минут'])}`;
    }
    return result + ' назад';
  }

  private pluralize(n: number, [one, twoToFour, fivePlus]: [string, string, string]): string {
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 14) return fivePlus;
    const mod10 = n % 10;
    if (mod10 === 1)      return one;
    if (mod10 >= 2 && mod10 <= 4) return twoToFour;
    return fivePlus;
  }
}
