import { Routes } from '@angular/router';
import { Product } from './features/product/product';
import { Test } from './core/test/test/test';
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
