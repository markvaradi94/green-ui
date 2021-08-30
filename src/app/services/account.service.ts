import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account } from '../dto/account.dto';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public accountSubj = new Subject<Account>();
  private ACCOUNT_STORAGE_KEY = 'account';

  constructor(private storage: Storage,
              private apiService: ApiService) {
    this.storage.create();
  }

  accountObservable(): Observable<Account> {
    return this.accountSubj.asObservable();
  }

  saveAccount(account: Account): void {
    this.storage.set(this.ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  }

  emptyStorage() {
    this.storage.clear();
  }

  async getAccount(): Promise<string> {
    return await this.storage.get(this.ACCOUNT_STORAGE_KEY);
  }

  patchAccount(account: Account, patch: any) {
    this.apiService.patchAccount(account.id, patch).subscribe(() => {
    });
  }
}
