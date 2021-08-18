import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../dto/client.dto';
import { Address } from '../../dto/address.dto';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
})
export class ClientDetailsPage implements OnInit {

  clientId: string = null;
  client: Client = new Client();

  constructor(private apiService: ApiService,
              private accountService: AccountService,
              private clientService: ClientService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.clientId = this.activatedRoute.snapshot.paramMap.get('clientId');

    this.apiService.getClient(this.clientId).subscribe(result => {
      this.client = result;
    });

    this.client.address = new Address();
  }

  editClient() {

    const clientPatch = [
      {op: 'replace', path: '/firstName', value: this.client.firstName},
      {op: 'replace', path: '/lastName', value: this.client.lastName},
      {op: 'replace', path: '/address', value: this.client.address},
    ];

    this.apiService.patchClient(this.client.id, clientPatch).subscribe(() => {});

  }
}
