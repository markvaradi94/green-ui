import { Component } from '@angular/core';
import { GreenBag } from '../../dto/green-bag.dto';
import { Account } from '../../dto/account.dto';
import { Provider } from '../../dto/provider.dto';
import { Subject } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';
import { ProviderService } from '../../services/provider.service';
import { Router } from '@angular/router';
import { Inventory } from '../../dto/inventory.dto';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage {

  account: Account;
  provider: Provider;
  bags: GreenBag[] = [];
  inventory: Inventory;

  private unsubscribe = new Subject<void>();

  constructor(private apiService: ApiService,
              private accountService: AccountService,
              private providerService: ProviderService,
              private router: Router) {
  }

  async ionViewDidEnter() {
    await this.accountService.getAccount().then(result => this.account = JSON.parse(result));

    if (this.account?.type === 'PROVIDER') {
      await this.providerService.getProvider().then(result => this.provider = JSON.parse(result));
      this.bags = this.provider.inventory.bags;
      this.inventory = this.provider.inventory;
    }
  }

  manageBag(bag: GreenBag): void {
    this.router.navigateByUrl(`/providers/${this.provider.id}/bags/${bag.id}/info`);
  }

  addNewBag(): void {
    this.router.navigateByUrl(`/providers/${this.provider.id}/new-bag`);
  }

}
