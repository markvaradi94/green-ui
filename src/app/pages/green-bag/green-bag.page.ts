import { Component, OnInit } from '@angular/core';
import { GreenBag } from '../../dto/green-bag.dto';
import { Client } from '../../dto/client.dto';
import { Provider } from '../../dto/provider.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProviderService } from '../../services/provider.service';
import { ClientService } from '../../services/client.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'green-bag-page',
  templateUrl: './green-bag.page.html',
  styleUrls: ['./green-bag.page.scss'],
})
export class GreenBagPage implements OnInit {

  bagId: string = null;
  providerId: string = null;
  client: Client;
  provider: Provider;
  greenBag: GreenBag;
  amountToOrder: number = 0;

  private unsubscribe = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService,
              private providerService: ProviderService,
              private clientService: ClientService,
              private router: Router) {
  }

  ngOnInit() {
    this.bagId = this.activatedRoute.snapshot.paramMap.get('bagId');
    this.providerId = this.activatedRoute.snapshot.paramMap.get('providerId');

    this.fetchClient();
    this.fetchProviderAndBag();
  }

  ionViewDidLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  addToCart() {
    let newBag = {...this.greenBag};
    newBag.quantity = this.amountToOrder;

    if (this.isFromSameProvider() || this.isCartWithNoProvider()) {
      this.client.cart.providerId = this.provider.id;
      if (this.client?.cart.bags.length !== 0) {
        let tempBag = this.client.cart.bags.find(bag => bag.id === newBag.id);
        if (tempBag !== undefined) {
          tempBag.quantity = tempBag.quantity + newBag.quantity
        } else {
          this.client.cart.bags.push(newBag);
        }
      } else {
        this.client.cart.bags.push(newBag);
      }

      this.amountToOrder = 0;
      this.updateClient(this.client);
    } else {
      throw new Error('Cannot add to cart from different restaurant when there are already items in the cart!');
    }
  }

  isFromSameProvider(): boolean {
    return this.client.cart.providerId === this.provider.id;
  }

  isCartWithNoProvider(): boolean {
    return this.client.cart.providerId === null || this.client.cart.providerId.length === 0;
  }

  updateClient(client: Client): void {
    const clientPatch = [{
      op: 'replace', path: '/cart', value:
        {
          providerId: this.provider.id,
          bags: client.cart.bags
        }
    }];

    this.apiService.patchClient(client.id, clientPatch)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.clientService.clientSubj.next(result);
        this.clientService.saveClient(result);
      });
  }

  canBeIncreased(): boolean {
    return this.amountToOrder < this.greenBag?.quantity;
  }

  canBeDecreased(): boolean {
    return this.amountToOrder > 0;
  }

  increaseAmount() {
    if (this.amountToOrder < this.greenBag?.quantity) {
      this.amountToOrder++;
    }
  }

  decreaseAmount() {
    if (this.amountToOrder > 0) {
      this.amountToOrder--;
    }
  }

  private fetchClient(): void {
    this.clientService.getClient().then(result => this.client = JSON.parse(result));
  }

  private fetchProviderAndBag(): void {
    this.apiService.getProvider(this.providerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.provider = result;
        this.greenBag = this.provider.inventory.bags.find(bag => bag.id === this.bagId);
      });
  }
}
