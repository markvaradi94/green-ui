import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { ClientService } from './services/client.service';
import { ProviderService } from './services/provider.service';
import { OrderService } from './services/order.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform,
              private accountService: AccountService,
              private clientService: ClientService,
              private providerService: ProviderService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.accountService.emptyStorage();
    this.clientService.emptyStorage();
    this.providerService.emptyStorage();
    this.orderService.emptyStorage();
  }
}
