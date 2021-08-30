import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'providers/:id',
    loadChildren: () => import('./pages/provider-details/provider-details.module').then( m => m.ProviderDetailsPageModule)
  },
  {
    path: 'providers/:providerId/bags/:bagId',
    loadChildren: () => import('./pages/green-bag/green-bag.module').then( m => m.GreenBagPageModule)
  },
  {
    path: 'clients/:clientId/details',
    loadChildren: () => import('./pages/client-details/client-details.module').then( m => m.ClientDetailsPageModule)
  },
  {
    path: 'orders/:orderId',
    loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'providers/:providerId/info',
    loadChildren: () => import('./pages/provider-info/provider-info.module').then( m => m.ProviderInfoPageModule)
  },
  {
    path: 'providers/:providerId/bags/:bagId/info',
    loadChildren: () => import('./pages/bag-info/bag-info.module').then( m => m.BagInfoPageModule)
  },
  {
    path: 'providers/:providerId/new-bag',
    loadChildren: () => import('./pages/new-bag/new-bag.module').then( m => m.NewBagPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
