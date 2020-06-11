import { NgModule } from '@angular/core';
import { MakeRoutingModule } from './make-routing.module';
import { Router, ActivatedRoute, Params } from '@angular/router'; // if use url parameters.
import { MakeComponent } from './make.component';

@NgModule({
  imports: [MakeRoutingModule],
  declarations: [MakeComponent],
  exports: [MakeComponent],
})
export class MakeModule {}
