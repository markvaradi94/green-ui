import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account } from '../dto/account.dto';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public accountSubj = new Subject<Account>();
  private ACCOUNT_STORAGE_KEY = 'account';

  constructor(private storage: Storage) {
    this.storage.create();
  }

  accountObservable(): Observable<Account> {
    return this.accountSubj.asObservable();
  }

  saveAccount(account: Account): void {
    this.storage.set(this.ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  }

  async getAccount(): Promise<Account> {
    return await this.storage.get(this.ACCOUNT_STORAGE_KEY);
  }
}
