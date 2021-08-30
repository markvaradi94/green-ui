import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { ClientService } from '../../services/client.service';
import { ProviderService } from '../../services/provider.service';
import { Client } from '../../dto/client.dto';
import { ApiService } from '../../services/api.service';
import { Account } from '../../dto/account.dto';
import { HttpParams } from '@angular/common/http';
import { Provider } from '../../dto/provider.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{
  headerTitle = 'My Profile';
  account: Account;
  provider: Provider;
  client: Client;

  private unsubscribe = new Subject<void>();

  constructor(private router: Router,
              private apiService: ApiService,
              private accountService: AccountService,
              private clientService: ClientService,
              private providerService: ProviderService,
              private orderService: OrderService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.accountService.accountObservable()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.account = result;
        this.getInfoForAccount();
        this.headerTitle = this.account ? this.account.email : 'My Profile';
      });

    if (this.account?.type === 'CLIENT') {
      this.fetchClient();
    } else if (this.account?.type === 'PROVIDER') {
      this.fetchProvider();
    }

  }

  async fetchClient() {
    await this.clientService.getClient().then(result => {
      this.client = JSON.parse(result);
    });
  }

  async fetchProvider() {
    await this.providerService.getProvider().then(result => {
      this.provider = JSON.parse(result);
    });
  }

  ionViewDidLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  editProfile(): void {
    if (this.client){
      this.router.navigateByUrl(`/clients/${this?.client?.id}/details`);
    } else if (this.provider) {
      this.router.navigateByUrl(`/providers/${this?.provider?.id}/info`)
    }
  }

  getInfoForAccount() {
    let params = new HttpParams();
    if (this.account) {
      params = params.append('accountId', this.account.id);
    }

    if (this.account && this.account.type === 'CLIENT') {
      this.apiService.getClientForAccount(params)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(clients => {
          if (clients.length === 1) {
            this.client = clients[0];
            this.clientService.clientSubj.next(this.client);
          } else if (clients.length === 0) {
            this.clientService.emptyStorage();
          }
        });
    } else if (this.account && this.account.type === 'PROVIDER') {
      this.apiService.getProviderForAccount(params)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(providers => {
          if (providers.length === 1) {
            this.provider = providers[0];
            this.providerService.providerSubj.next(this.provider);
          } else if (providers.length === 0) {
            this.providerService.emptyStorage();
          }
        });
    }
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    this.account = null;
    this.client = null;
    this.provider = null;
    this.headerTitle = 'My Profile';

    this.accountService.emptyStorage();
    this.clientService.emptyStorage();
    this.providerService.emptyStorage();
    this.orderService.emptyStorage();
  }

  get accountIsLoggedIn(): boolean {
    return !!this.account;
  }
}
