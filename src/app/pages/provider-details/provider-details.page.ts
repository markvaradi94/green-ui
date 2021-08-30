import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../dto/provider.dto';
import { Client } from '../../dto/client.dto';
import { ClientService } from '../../services/client.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.page.html',
  styleUrls: ['./provider-details.page.scss'],
})
export class ProviderDetailsPage implements OnInit {

  providerId: string = null;
  provider: Provider;
  client: Client;

  private unsubscribe = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService,
              private providerService: ProviderService,
              private clientService: ClientService,
              private router: Router) {
  }

  ngOnInit() {
    this.providerId = this.activatedRoute.snapshot.paramMap.get('id');

    this.apiService.getProvider(this.providerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.provider = result;
        this.providerService.saveProvider(this.provider);
        this.providerService.providerSubj.next(this.provider);
      });

    this.fetchClient();
  }

  ionViewDidLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  fetchClient() {
    this.clientService.clientObservable()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.client = result;
      });
  }
}
