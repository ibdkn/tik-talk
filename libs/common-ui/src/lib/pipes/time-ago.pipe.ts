import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) return null;

    // Дата из ISO (в UTC) в локальное время
    const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
    const now = DateTime.local();

    // Если дата в будущем или некорректная - просто выводим ее как есть
    if (!date.isValid || date > now) {
      return date.toFormat("dd.MM.yyyy 'в' HH:mm");
    }

    const diffSec = Math.floor(now.diff(date, 'seconds').seconds);
    const diffMin = Math.floor(now.diff(date, 'minutes').minutes);
    const diffHours = Math.floor(now.diff(date, 'hours').hours);

    // если прошло более суток — возвращаем абсолютную дату
    if (diffHours >= 24) {
      return date.toFormat("dd.MM.yyyy 'в' HH:mm");
    }

    // меньше минуты
    if (diffSec < 60) {
      if (diffSec < 5) return 'только что';
      return `${diffSec} ${this.pluralize(diffSec, [
        'секунда',
        'секунды',
        'секунд',
      ])} назад`;
    }

    // меньше часа
    if (diffMin < 60) {
      return `${diffMin} ${this.pluralize(diffMin, [
        'минута',
        'минуты',
        'минут',
      ])} назад`;
    }

    // часы + минуты (в пределах одних суток)
    const remMin = diffMin % 60;

    let result = `${diffHours} ${this.pluralize(diffHours, [
      'час',
      'часа',
      'часов',
    ])}`;
    if (remMin > 0) {
      result += ` ${remMin} ${this.pluralize(remMin, [
        'минута',
        'минуты',
        'минут',
      ])}`;
    }
    return result + ' назад';
  }

  private pluralize(
    n: number,
    [one, twoToFour, fivePlus]: [string, string, string]
  ): string {
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 14) return fivePlus;
    const mod10 = n % 10;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return twoToFour;
    return fivePlus;
  }
}
