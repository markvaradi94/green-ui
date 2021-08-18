import { Component, OnDestroy, OnInit } from '@angular/core';
import { GreenBag } from '../../dto/green-bag.dto';
import { Client } from '../../dto/client.dto';
import { Provider } from '../../dto/provider.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProviderService } from '../../services/provider.service';
import { ClientService } from '../../services/client.service';

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

  addToCart() {
    const diff = this.greenBag.quantity - this.amountToOrder;
    let newBag = {...this.greenBag};
    newBag.quantity = this.amountToOrder;

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

    this.client.cart.providerId = this.provider.id;
    this.greenBag.quantity = diff;

    let providerBag = this.provider.inventory.bags.find(bag => bag.id === this.bagId);
    providerBag.quantity = diff;
    this.amountToOrder = 0;

    const clientPatch = [{
      op: 'replace', path: '/cart', value:
        {
          providerId: this.provider.id,
          bags: this.client.cart.bags
        }
    }];

    const providerPatch = [{
      op: 'replace', path: '/inventory', value:
        {
          bags: this.provider.inventory.bags
        }
    }];

    this.apiService.patchClient(this.client.id, clientPatch).subscribe(result => {
      this.clientService.clientSubj.next(result);
    });
    this.apiService.patchProvider(this.provider.id, providerPatch).subscribe(result => {
      this.providerService.providerSubj.next(result);
    });
  }

  fetchClient(): void {
    this.clientService.getClient().then(result => this.client = JSON.parse(result));
  }

  fetchProviderAndBag(): void {
    this.apiService.getProvider(this.providerId).subscribe(result => {
      this.provider = result;
      this.greenBag = this.provider.inventory.bags.find(bag => bag.id === this.bagId);
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
}
