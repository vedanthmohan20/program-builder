import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preserveTitlecase',
  standalone: true
})
export class PreserveTitlecasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      .split(' ')
      .map(word => {
        if (word.length > 1 && word === word.toUpperCase()) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
