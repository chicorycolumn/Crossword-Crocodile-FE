import { NgModule } from '@angular/core';
import { MakeRoutingModule } from './make-routing.module';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router'; // if use url parameters.
import { MakeComponent } from './make.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { SocketioService } from '../services/socketio.service';

@NgModule({
  imports: [
    MakeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [MakeComponent],
  providers: [SocketioService],
  exports: [MakeComponent],
})
export class MakeModule {}
