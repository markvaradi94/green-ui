import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { OrderService } from './services/order.service';
import { AccountService } from './services/account.service';
import { ClientService } from './services/client.service';
import { ProviderService } from './services/provider.service';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Storage,
    OrderService,
    AccountService,
    ClientService,
    ProviderService,
    ApiService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
