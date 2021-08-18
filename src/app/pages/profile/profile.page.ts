import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AccountType } from '../../dto/enums/account-type';
import { ClientService } from '../../services/client.service';
import { ProviderService } from '../../services/provider.service';
import { Client } from '../../dto/client.dto';
import { ApiService } from '../../services/api.service';
import { Account } from '../../dto/account.dto';
import { HttpParams } from '@angular/common/http';
import { Provider } from '../../dto/provider.dto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  headerTitle = 'My Profile';
  account: Account;
  provider: Provider;
  client: Client;

  constructor(private router: Router,
              private apiService: ApiService,
              private accountService: AccountService,
              private clientService: ClientService,
              private providerService: ProviderService) {
  }

  ngOnInit() {
    this.accountService.accountSubj.subscribe(result => {
      this.account = result;
      this.headerTitle = this.account ? this.account.email : 'My Profile';
      this.getInfoForAccount();
    });
  }

  editProfile(clientId: string): void {
    this.router.navigateByUrl(`/clients/${clientId}/details`);
  }

  getInfoForAccount() {
    let params = new HttpParams();
    if (this.account) {
      params = params.append('accountId', this.account.id);
    }

    if (this.account && this.account.type === 'CLIENT') {
      this.apiService.getClientForAccount(params).subscribe(clients => {
        if (clients.length === 1) {
          this.client = clients[0];
        }
      });
    } else if (this.account && this.account.type === 'PROVIDER') {
      this.apiService.getProviderForAccount(params).subscribe(providers => {
        if (providers.length === 1) {
          this.provider = providers[0];
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
  }

  get accountIsLoggedIn(): boolean {
    return this.account !== undefined && this.account !== null;
  }
}
