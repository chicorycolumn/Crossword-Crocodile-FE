import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LearnComponent } from './learn.component';

const routes: Routes = [
  { path: 'learn', component: LearnComponent }, // or path: 'customers/:custID'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnRoutingModule {}
