import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GreenBagPageRoutingModule } from './green-bag-routing.module';

import { GreenBagPage } from './green-bag.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GreenBagPageRoutingModule
    ],
    exports: [
        GreenBagPage
    ],
    declarations: [GreenBagPage]
})
export class GreenBagPageModule {}
