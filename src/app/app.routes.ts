import { Routes } from '@angular/router';
import { Product } from './features/product/product';
import { Test } from './core/test/test/test';

export const routes: Routes = [
  { path: '', component: Test },
  { path: 'products', component: Product },
  { path: 'test', component: Test },
];
