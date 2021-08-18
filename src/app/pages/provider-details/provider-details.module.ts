import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProviderDetailsPageRoutingModule } from './provider-details-routing.module';

import { ProviderDetailsPage } from './provider-details.page';
import { GreenBagPageModule } from '../green-bag/green-bag.module';
import { BagListComponent } from '../../components/bag-list/bag-list.component';
import { GreenBagComponent } from '../../components/green-bag/green-bag.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProviderDetailsPageRoutingModule,
        GreenBagPageModule
    ],
  declarations: [ProviderDetailsPage, BagListComponent, GreenBagComponent]
})
export class ProviderDetailsPageModule {}
