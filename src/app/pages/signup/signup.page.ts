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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Address } from '../../dto/address.dto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  account: Account = new Account();

  private unsubscribe = new Subject<void>();
  firstName: string;
  lastName: string;
  address: Address = new Address();

  constructor(private apiService: ApiService,
              private router: Router,
              private accountService: AccountService,
              private clientService: ClientService,
              private providerService: ProviderService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  doSignup() {
    this.apiService.addNewAccount(this.account)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.account = result as Account;
        this.accountService.accountSubj.next(this.account);
        this.accountService.saveAccount(this.account);
        this.getInfoForAccount();

        this.router.navigateByUrl('/tabs/home');
      });
  }

  editClient(client: Client) {
    const clientPatch = [
      {op: 'replace', path: '/firstName', value: this.firstName},
      {op: 'replace', path: '/lastName', value: this.lastName},
      {op: 'replace', path: '/address', value: this.address},
    ];

    this.clientService.patchClient(client, clientPatch);
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
            this.clientService.clientSubj.next(clients[0] as Client);
            this.clientService.saveClient(clients[0] as Client);
            this.editClient(clients[0]);
          }
        });
    } else if (this.account && this.account.type === 'PROVIDER') {
      this.apiService.getProviderForAccount(params)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(providers => {
          if (providers.length === 1) {
            this.providerService.providerSubj.next(providers[0] as Provider);
            this.providerService.saveProvider(providers[0] as Provider);
          }
        });
    }
  }
}
