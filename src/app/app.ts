import { Component, inject, OnInit, signal } from '@angular/core';
import { take } from 'rxjs';
import { Neon } from './core/services/neon/neon';
import { Storage } from './core/services/storage/storage';
import { Product } from './features/product-list/models/product.model';
import { Network } from './core/services/network/network';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  // Injections
  private neonService = inject(Neon);
  protected storageService = inject(Storage);
  protected networkService = inject(Network);

  // Prop
  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.neonService
      .getProducts()
      .pipe(take(1))
      .subscribe((data: Product[]) => this.products.set(data));
  }
}
