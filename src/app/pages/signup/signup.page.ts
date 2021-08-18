import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Account } from '../../dto/account.dto';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { HttpParams } from '@angular/common/http';
import { ClientService } from '../../services/client.service';
import { ProviderService } from '../../services/provider.service';
import { Client } from '../../dto/client.dto';
import { Provider } from '../../dto/provider.dto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  account: Account = new Account();

  constructor(private apiService: ApiService,
              private router: Router,
              private accountService: AccountService,
              private clientService: ClientService,
              private providerService: ProviderService) {
  }

  ngOnInit() {
  }

  doSignup() {
    this.apiService.addNewAccount(this.account).subscribe(result => {

      this.account = result as Account;
      this.accountService.accountSubj.next(this.account);
      this.accountService.saveAccount(this.account);
      this.getInfoForAccount();

      this.router.navigateByUrl('/tabs/home');
    });
  }

  getInfoForAccount() {
    let params = new HttpParams();
    if (this.account) {
      params = params.append('accountId', this.account.id);
    }

    if (this.account && this.account.type === 'CLIENT') {
      this.apiService.getClientForAccount(params).subscribe(clients => {
        if (clients.length === 1) {
          this.clientService.clientSubj.next(clients[0] as Client);
          this.clientService.saveClient(clients[0] as Client);
        }
      });
    } else if (this.account && this.account.type === 'PROVIDER') {
      this.apiService.getProviderForAccount(params).subscribe(providers => {
        if (providers.length === 1) {
          this.providerService.providerSubj.next(providers[0] as Provider);
          this.providerService.saveProvider(providers[0] as Provider);
        }
      });
    }
  }
}
