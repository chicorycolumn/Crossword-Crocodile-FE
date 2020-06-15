import { NgModule } from '@angular/core';
import { LearnRoutingModule } from './learn-routing.module';
import { Router, ActivatedRoute, Params } from '@angular/router'; // if use url parameters.
import { LearnComponent } from './learn.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [LearnRoutingModule, SharedModule],
  declarations: [LearnComponent],
  exports: [LearnComponent],
})
export class LearnModule {}
