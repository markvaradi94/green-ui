import { Component } from '@angular/core';
import { Client } from '../../dto/client.dto';
import { ClientService } from '../../services/client.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../dto/cart.dto';
import { Order } from '../../dto/order.dto';
import { OrderStatus } from '../../dto/enums/order-status';
import { GreenBag } from '../../dto/green-bag.dto';
import { ApiService } from '../../services/api.service';
import { Provider } from '../../dto/provider.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
  client: Client;
  provider: Provider;
  cart: Cart;

  private unsubscribe = new Subject<void>();

  constructor(private clientService: ClientService,
              private orderService: OrderService,
              private providerService: ProviderService,
              private apiService: ApiService) {
  }

  async ionViewDidEnter() {
    await this.clientService.getClient().then(result => {
      this.client = JSON.parse(result);
      this.fetchClientDetails(this.client);
    });
  }

  fetchClientDetails(client: Client): void {
    if (client != null) {
      this.cart = client.cart;

      if (this.cart.providerId) {
        this.apiService.getProvider(this.cart.providerId)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(result => {
            this.provider = result;
          });
      }
    }
  }

  ionViewDidLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  placeOrder() {
    if (this.client) {
      const order = this.createOrder(this.cart);

      this.orderService.placeOrder(order)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => {
        });

      this.addOrderAndUpdateInventory(order);
      this.emptyCartForClient();
    }
  }

  deleteBag(bag: GreenBag): void {
    const index = this.client.cart.bags.indexOf(bag, 0);
    if (index > -1) {
      this.client.cart.bags.splice(index, 1);

      if (this.client.cart.bags.length === 0) {
        this.provider = null;
        this.client.cart.providerId = null;
      }

      const clientPatch = [{
        op: 'replace', path: '/cart', value:
          {
            bags: this.client.cart.bags,
            providerId: this.cart.providerId
          }
      }];

      this.apiService.patchClient(this.client.id, clientPatch)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(result => {
          this.clientService.clientSubj.next(result);
          this.clientService.saveClient(result);
        });
    }
  }

  decreaseQuantity(bag: GreenBag): void {
    const cartBag = this.cart.bags.find(temp => temp.id === bag.id);
    cartBag.quantity--;

    const clientPatch = [{
      op: 'replace', path: '/cart', value:
        {
          bags: this.client.cart.bags,
          providerId: this.cart.providerId
        }
    }];

    this.apiService.patchClient(this.client.id, clientPatch)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.clientService.clientSubj.next(result);
        this.clientService.saveClient(result);
      });
  }

  increaseQuantity(bag: GreenBag): void {
    const cartBag = this.cart.bags.find(temp => temp.id === bag.id);
    cartBag.quantity++;

    const clientPatch = [{
      op: 'replace', path: '/cart', value:
        {
          bags: this.client.cart.bags,
          providerId: this.cart.providerId
        }
    }];

    this.apiService.patchClient(this.client.id, clientPatch)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.clientService.clientSubj.next(result);
        this.clientService.saveClient(result);
      });
  }

  private addOrderAndUpdateInventory(order: Order): void {
    this.apiService.getProvider(order.providerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.provider = result;

        this.provider.dashboard.orders.push(order);
        const updatedIds = this.bagsToUpdateIds();

        this.provider.inventory.bags.forEach(bag => {
          if (updatedIds.includes(bag.id)) {
            let tempBag = this.cart.bags.find(cartBag => cartBag.id === bag.id);
            bag.quantity -= tempBag.quantity;
          }
        });

        const providerPatch = [
          {
            op: 'replace', path: '/dashboard', value:
              {
                orders: this.provider.dashboard.orders
              }
          },
          {
            op: 'replace', path: '/inventory', value:
              {
                bags: this.provider.inventory.bags
              }
          }
        ];

        this.apiService.patchProvider(this.provider.id, providerPatch)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(result => {
            this.providerService.providerSubj.next(result);
          });

        this.provider = null;
      });
  }

  isMaximumProviderQuantity(bag: GreenBag): boolean {
    const providerBag = this?.provider?.inventory?.bags.find(temp => temp.id === bag.id);
    return bag?.quantity === providerBag?.quantity;
  }

  private bagsToUpdateIds(): string[] {
    return this.provider?.inventory?.bags
      .filter(bag => this.cartBagIds.includes(bag?.id))
      .map(bag => bag?.id);
  }

  get cartBagIds(): Array<string> {
    return this.cart.bags.map(bag => bag.id);
  }

  private emptyCartForClient(): void {
    this.client.cart = new Cart();

    const clientPatch = [{
      op: 'replace', path: '/cart', value:
        {
          providerId: null,
          bags: this.client.cart.bags
        }
    }];

    this.apiService.patchClient(this.client.id, clientPatch)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.clientService.clientSubj.next(result);
        this.clientService.saveClient(result);
      });
  }

  private createOrder(cart: Cart): Order {
    return new Order(
      this.client.id,
      cart.providerId,
      OrderStatus.PLACED,
      cart.bags,
      cart.totalPrice
    );
  }
}
