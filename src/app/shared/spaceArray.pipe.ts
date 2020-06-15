import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'spaceArray' })
export class spaceArrayPipe implements PipeTransform {
  transform(val: any) {
    if (typeof val === 'object') {
      return val.join(', ');
    } else return val;
  }
}
