import { Component, OnInit } from '@angular/core';
import { Provider } from '../../dto/provider.dto';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  providers: Provider[] = [];

  constructor(private apiService: ApiService,
              private router: Router) {
  }

  ngOnInit() {
    this.apiService.getAllProviders().subscribe(result => {
      this.providers = result;
    })
  }

  openProvider(provider: Provider): void {
    const id = provider.id;
    this.router.navigateByUrl(`providers/${id}`);
  }
}
