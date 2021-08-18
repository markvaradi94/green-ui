import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Client } from '../dto/client.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public clientSubj = new Subject<Client>();
  private CLIENT_STORAGE_KEY = 'client';

  constructor(private storage: Storage) {
    this.storage.create();
  }

  clientObservable(): Observable<Client> {
    return this.clientSubj.asObservable();
  }

  saveClient(client: Client): void {
    this.storage.set(this.CLIENT_STORAGE_KEY, JSON.stringify(client));
  }

  emptyStorage(): void {
    this.storage.clear();
  }

  async getClient(): Promise<string> {
    return await this.storage.get(this.CLIENT_STORAGE_KEY);
  }
}
