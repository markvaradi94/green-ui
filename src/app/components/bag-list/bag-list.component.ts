import { Component, Input, OnInit } from '@angular/core';
import { GreenBag } from '../../dto/green-bag.dto';
import { Provider } from '../../dto/provider.dto';
import { Client } from '../../dto/client.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bag-list',
  templateUrl: './bag-list.component.html',
  styleUrls: ['./bag-list.component.scss'],
})
export class BagListComponent implements OnInit {

  @Input('bags')
  bags: GreenBag[] = [];

  @Input('provider')
  provider: Provider;

  @Input('client')
  client: Client;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }
}
