import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, of, switchMap, take } from 'rxjs';

import { Neon } from '../../core/services/neon/neon';
import { Network } from '../../core/services/network/network';
import { Status } from '../../core/services/network/network.model';
import { OfflineActions } from '../../core/services/offline-actions/offline-actions';
import { HTTPAction } from '../../core/services/offline-actions/offline-actions.model';
import { Storage } from '../../core/services/storage/storage';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Search } from '../shared/search/search';
import { NoDataTemplate } from '../shared/templates/no-data-template/no-data-template';
import { SpinnerTemplate } from '../shared/templates/spinner-template/spinner-template';
import { ProductModel } from './models/product.model';
import { ProductList } from './product-list/product-list';

@Component({
  selector: 'pwa-product',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    ProductList,
    Search,
    NoDataTemplate,
    SpinnerTemplate,
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  // ─── Injections ───────────────────────────────────────────────────────
  private readonly neonService = inject(Neon);
  protected readonly networkService = inject(Network);
  protected readonly storageService = inject(Storage);
  protected readonly offlineActionsService = inject(OfflineActions);
  private readonly snackbar = inject(MatSnackBar);

  // ─── ViewChild ─────────────────────────────────────────────────────────
  private readonly searchInputRef = viewChild<Search>('search');

  // ─── Signals ───────────────────────────────────────────────────────────
  protected readonly products = signal<ProductModel[]>([]);
  private readonly filter = signal('');
  private readonly isOnline = computed(
    () => this.networkService.status() === Status.Online,
  );

  // ─── Computed ──────────────────────────────────────────────────────────
  dataSource = computed(() => {
    const search = this.filter().toLowerCase().trim();
    const all = this.products();

    if (!search) return new MatTableDataSource(all);

    const filtered = all.filter((product) =>
      Object.values(product).some((value) =>
        value?.toString().toLowerCase().includes(search),
      ),
    );

    return new MatTableDataSource(filtered);
  });

  // ─── Effect ──────────────────────────────────────────────────────────
  reloadProductsEffect = effect(() => {
    if (this.isOnline()) {
      this.neonService
        .getProducts()
        .pipe(take(1))
        .subscribe((products) => {
          this.products.set(products);
        });
    }
  });

  // ─── Public Methods ────────────────────────────────────────────────────

  applyFilter(filterValue: string) {
    this.filter.set(filterValue);
  }

  resetFilter() {
    this.filter.set('');
    this.searchInputRef()?.resetFilter();
  }

  onUpdateRow(id: ProductModel['id']) {
    console.log(id);
  }

  onDeleteRow(id: ProductModel['id']) {
    if (!id) return;

    if (this.isOnline()) {
      console.log('Immediately call delete product.');
      // this.neonService.deleteProduct(id).subscribe();
    } else {
      this.offlineActionsService.actionQueue.update((prev) => [
        ...prev,
        { id, action: HTTPAction.DELETE },
      ]);
      this.snackbar.open('Product delete queued (offline)', 'Dismiss', {
        duration: 3000,
      });
    }
  }

  // ─── Utility / Fallback Logic ──────────────────────────────────────────

  /** ⚠️ For demonstration purposes only. SW already handles caching. */
  private loadProductsWithFallbackCache(): void {
    const key = this.storageService.key();

    this.storageService
      .checkForCachedData<
        ProductModel[] | { data: ProductModel[]; updated_at: string }
      >(key)
      .pipe(
        catchError(() =>
          this.neonService.getProducts().pipe(
            switchMap((data: ProductModel[]) => {
              this.storageService.save(key, data, true);
              return of({ data, updated_at: new Date().toISOString() });
            }),
          ),
        ),
        take(1),
      )
      .subscribe({
        next: (products) => {
          if ('data' in products && 'updated_at' in products) {
            this.products.set(products.data);

            if (this.storageService.hasExpired(products.updated_at)) {
              console.warn('Data expired, a new fetch should occur.');
              this.storageService.delete(key);
              this.storageService.updateKey();
            }
          } else {
            this.products.set(products);
          }
        },
        error: (error) => {
          alert(error.message || 'Something went wrong');
        },
      });
  }
}
