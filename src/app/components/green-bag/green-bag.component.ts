import { Component, Input, OnInit } from '@angular/core';
import { GreenBag } from '../../dto/green-bag.dto';
import { Provider } from '../../dto/provider.dto';
import { Client } from '../../dto/client.dto';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'green-bag-component',
  templateUrl: './green-bag.component.html',
  styleUrls: ['./green-bag.component.scss'],
})
export class GreenBagComponent implements OnInit {

  @Input('bag')
  bag: GreenBag;

  @Input('provider')
  provider: Provider;

  @Input('client')
  client: Client;

  constructor(private router: Router,
              private orderService: OrderService) { }

  ngOnInit() {}

  openBag(bag: GreenBag) {
    const bagId = bag.id;
    const providerId = this.provider.id;
    this.router.navigateByUrl(`/providers/${providerId}/bags/${bagId}`);
  }

}
