import { NgModule } from '@angular/core';

import { formatCoordPipe } from './formatCoord.pipe';
import { spaceArrayPipe } from './spaceArray.pipe';
import { WigglyDirective } from '../wiggly.directive';

@NgModule({
  declarations: [formatCoordPipe, spaceArrayPipe, WigglyDirective],
  exports: [formatCoordPipe, spaceArrayPipe, WigglyDirective],
})
export class SharedModule {}
