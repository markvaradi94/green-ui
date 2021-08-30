import { Component } from '@angular/core';
import { Provider } from '../../dto/provider.dto';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../dto/account.dto';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  account: Account;
  providers: Provider[] = [];
  isClient: boolean;

  private unsubscribe = new Subject<void>();

  constructor(private apiService: ApiService,
              private accountService: AccountService,
              private router: Router) {
  }

  async ionViewDidEnter() {
    this.apiService.getAllProviders()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.providers = result;
      });

    await this.accountService.getAccount().then(result => {
      this.account = JSON.parse(result)
      this.isClient = this.isClientAccount();
    });
  }

  shouldShowProviders(): boolean {
    return this.isClientAccount() || !this.account;
  }

  isClientAccount(): boolean {
    if (this.account) {
      return this.account.type === 'CLIENT';
    }
  }

  isProviderAccount(): boolean {
    if (this.account) {
      return this.account.type === 'PROVIDER';
    }
  }

  ionViewDidLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openProvider(provider: Provider): void {
    const id = provider.id;
    this.router.navigateByUrl(`providers/${id}`);
  }
}
