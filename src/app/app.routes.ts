import { Routes } from '@angular/router';
import { Product } from './features/product/product';
import { Layout } from './features/layout/layout';
import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'products', component: Product },
    ],
  },
];
