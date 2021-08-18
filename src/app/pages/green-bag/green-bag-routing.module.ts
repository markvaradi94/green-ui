import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GreenBagPage } from './green-bag.page';

const routes: Routes = [
  {
    path: '',
    component: GreenBagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreenBagPageRoutingModule {}
