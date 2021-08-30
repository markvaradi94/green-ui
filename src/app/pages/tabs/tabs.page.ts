import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ProviderService } from '../../services/provider.service';
import { Client } from '../../dto/client.dto';
import { Provider } from '../../dto/provider.dto';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  client: Client;
  provider: Provider;

  constructor(private clientService: ClientService,
              private providerService: ProviderService) {
  }

  async ionViewDidEnter() {
    await this.clientService.getClient().then(result => this.client = JSON.parse(result));
    await this.providerService.getProvider().then(result => this.provider = JSON.parse(result));
  }
}
