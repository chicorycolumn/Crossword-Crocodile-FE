import { NgModule } from '@angular/core';
import { PlayRoutingModule } from './play-routing.module';
import { Router, ActivatedRoute, Params } from '@angular/router'; // if use url parameters.
import { PlayComponent } from './play.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PlayRoutingModule, SharedModule],
  declarations: [PlayComponent],
  exports: [PlayComponent],
})
export class PlayModule {}
