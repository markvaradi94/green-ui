import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Account } from '../../dto/account.dto';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { ClientService } from '../../services/client.service';
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../dto/provider.dto';
import { Client } from '../../dto/client.dto';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  account: Account;

  private unsubscribe = new Subject<void>();

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

  doLogin(form: NgForm) {
    let params = new HttpParams();
    params = params.append('email', form.value.email);
    params = params.append('password', form.value.password);

    this.apiService.getAccountForLogin(params)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
          if (result && result.length === 1) {
            this.account = result[0];
            this.accountService.accountSubj.next(this.account);
            this.accountService.saveAccount(this.account);
            this.getInfoForAccount();

            if (this.account.type === 'CLIENT'){
              this.router.navigateByUrl('/tabs/home');
            } else if (this.account.type === 'PROVIDER') {
              this.router.navigateByUrl('/tabs/order-history');
            }
          }
        }, error => throwError(error)
      );
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
          } else if (clients.length === 0) {
            this.clientService.emptyStorage();
          }
        });
    } else if (this.account && this.account.type === 'PROVIDER') {
      this.apiService.getProviderForAccount(params)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(providers => {
          if (providers.length === 1) {
            this.providerService.providerSubj.next(providers[0] as Provider);
            this.providerService.saveProvider(providers[0] as Provider);
          } else if (providers.length === 0) {
            this.providerService.emptyStorage();
          }
        });
    }
  }
}
