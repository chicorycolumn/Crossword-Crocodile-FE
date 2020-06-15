import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatCoord' })
export class formatCoordPipe implements PipeTransform {
  transform(coord: string) {
    let arr = coord.split(/(\d+)/);
    let num = arr[1];
    let word = arr[2].toLowerCase();
    const ref = { ac: 'Across', do: 'Down' };
    return `${num} ${ref[word]}`;
  }
}
