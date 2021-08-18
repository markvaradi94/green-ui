import { Component, OnInit } from '@angular/core';
import { Client } from '../../dto/client.dto';
import { ClientService } from '../../services/client.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../dto/cart.dto';
import { Order } from '../../dto/order.dto';
import { OrderStatus } from '../../dto/enums/order-status';
import { GreenBag } from '../../dto/green-bag.dto';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  client: Client;

  constructor(private clientService: ClientService,
              private orderService: OrderService,
              private apiService: ApiService) {
  }

  ngOnInit() {
    this.clientService.clientObservable().subscribe(result => {
      this.client = result;
    });
  }

  createOrder(cart: Cart) {
    const order = new Order(
      this.client.id,
      cart.providerId,
      OrderStatus.PLACED,
      cart.bags,
      cart.totalPrice
    );

    this.orderService.placeOrder(order).subscribe(() => {
    });

    this.client.cart = new Cart();

    const clientPatch = [{
      op: 'replace', path: '/cart', value:
        {
          providerId: '',
          bags: this.client.cart.bags
        }
    }];

    this.apiService.patchClient(this.client.id, clientPatch).subscribe(() => {
    });
  }

  removeBag(bag: GreenBag): void {
    const index = this.client.cart.bags.indexOf(bag, 0);
    if (index > -1) {
      this.client.cart.bags.splice(index, 1);

      const clientPatch = [{
        op: 'replace', path: '/cart', value:
          {
            bags: this.client.cart.bags
          }
      }];

      this.apiService.patchClient(this.client.id, clientPatch).subscribe(() => {
      });
    }
  }
}
