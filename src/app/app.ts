import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Network } from './core/services/network/network';
import { Neon } from './core/services/neon/neon';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private networkService = inject(Network);
  private neonService = inject(Neon);

  protected title = 'pwa-offline';
  protected wifi = signal(false);
  protected switchToStorage = signal(false);

  protected products$ = this.neonService.getProducts().pipe(
    tap((products) =>
      localStorage.setItem('products', JSON.stringify(products)),
    ),
    shareReplay(1),
  );

  protected products = signal<any[]>([]);

  protected listenChanges = effect(
    () => this.switchToStorage() && this.fetchFromLocalStorage(),
  );

  ngOnInit(): void {
    this.networkService.network$.subscribe((status) => this.wifi.set(status));
  }

  fetchFromLocalStorage() {
    const raw = localStorage.getItem('products');
    if (raw) {
      try {
        const arr = JSON.parse(raw) as any[];
        this.products.set(arr);
      } catch (e) {
        console.error('Invalid JSON in storage', e);
      }
    }
  }
}
