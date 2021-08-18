import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage-angular';
import { Observable, Subject } from 'rxjs';
import { Order } from '../dto/order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orderSubj = new Subject<Order>();
  private ORDER_STORAGE_KEY = 'order';

  constructor(private apiService: ApiService,
              private storage: Storage) {
    this.storage.create();
  }

  orderObservable(): Observable<Order> {
    return this.orderSubj.asObservable();
  }

  saveOrder(order: Order): void {
    this.storage.set(this.ORDER_STORAGE_KEY, JSON.stringify(order));
  }

  placeOrder(order: Order): Observable<any> {
    return this.apiService.addOrder(order);
  }
}
