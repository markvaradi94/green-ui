import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderDetailsPage } from './provider-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProviderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderDetailsPageRoutingModule {}
