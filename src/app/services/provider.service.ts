import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Provider } from '../dto/provider.dto';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  public providerSubj = new Subject<Provider>();
  private PROVIDER_STORAGE_KEY = 'provider';

  constructor(private storage: Storage) {
    this.storage.create();
  }

  providerObservable(): Observable<Provider> {
    return this.providerSubj.asObservable();
  }

  saveProvider(provider: Provider): void {
    this.storage.set(this.PROVIDER_STORAGE_KEY, JSON.stringify(provider));
  }
}
