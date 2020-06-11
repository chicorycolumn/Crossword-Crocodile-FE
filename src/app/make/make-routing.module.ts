import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MakeComponent } from './make.component';

const routes: Routes = [
  { path: 'make', component: MakeComponent }, // or path: 'customers/:custID'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeRoutingModule {}
