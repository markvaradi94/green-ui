import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../dto/account.dto';
import { Order } from '../dto/order.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getAllAccounts(): Observable<any> {
    return this.http.get(`${environment.api}/accounts`);
  }

  getAccount(accountId: string): Observable<any> {
    return this.http.get(`${environment.api}/accounts/${accountId}`);
  }

  patchAccount(accountId: string, jsonPatch: any): Observable<any> {
    return this.http.patch(`${environment.api}/accounts/${accountId}`, jsonPatch);
  }

  patchOrder(orderId: string, jsonPatch: any): Observable<any> {
    return this.http.patch(`${environment.api}/orders/${orderId}`, jsonPatch);
  }

  getAccountForLogin(params: HttpParams): Observable<any> {
    return this.http.get(`${environment.api}/accounts`, {params});
  }

  addNewAccount(account: Account): Observable<any> {
    return this.http.post(`${environment.api}/accounts`, account);
  }

  getAllClients(): Observable<any> {
    return this.http.get(`${environment.api}/clients`);
  }

  getClient(clientId: string): Observable<any> {
    return this.http.get(`${environment.api}/clients/${clientId}`);
  }

  getClientForAccount(params: HttpParams): Observable<any> {
    return this.http.get(`${environment.api}/clients`, {params});
  }

  patchClient(clientId: string, jsonPatch: any): Observable<any> {
    return this.http.patch(`${environment.api}/clients/${clientId}`, jsonPatch)
  }

  getAllProviders(): Observable<any> {
    return this.http.get(`${environment.api}/providers`);
  }

  getProvider(providerId: string): Observable<any> {
    return this.http.get(`${environment.api}/providers/${providerId}`);
  }

  patchProvider(providerId: string, jsonPatch: any): Observable<any> {
    return this.http.patch(`${environment.api}/providers/${providerId}`, jsonPatch);
  }

  getProviderForAccount(params: HttpParams): Observable<any> {
    return this.http.get(`${environment.api}/providers`, {params});
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${environment.api}/orders`);
  }

  getFilteredOrders(params: HttpParams): Observable<any> {
    return this.http.get(`${environment.api}/orders`, {params});
  }

  getOrder(orderId: string): Observable<any> {
    return this.http.get(`${environment.api}/orders/${orderId}`);
  }

  addOrder(order: Order): Observable<any> {
    return this.http.post(`${environment.api}/orders`, order);
  }
}
