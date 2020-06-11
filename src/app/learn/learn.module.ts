import { NgModule } from '@angular/core';
import { LearnRoutingModule } from './learn-routing.module';
import { Router, ActivatedRoute, Params } from '@angular/router'; // if use url parameters.
import { LearnComponent } from './learn.component';

@NgModule({
  imports: [LearnRoutingModule],
  declarations: [LearnComponent],
  exports: [LearnComponent],
})
export class LearnModule {}
