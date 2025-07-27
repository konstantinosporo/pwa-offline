import {
  Component,
  computed, effect, inject,
  signal,
  viewChild
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, of, switchMap, take } from 'rxjs';
import { Neon } from '../../core/services/neon/neon';
import { Network } from '../../core/services/network/network';
import { Storage } from '../../core/services/storage/storage';
import { ProductList } from './product-list/product-list';
import { ProductModel } from './models/product.model';
import { Search } from '../shared/search/search';
import { NoDataTemplate } from '../shared/templates/no-data-template/no-data-template';
import { SpinnerTemplate } from '../shared/templates/spinner-template/spinner-template';
import { Status } from '../../core/services/network/network.model';
import { OfflineActions } from '../../core/services/offline-actions/offline-actions';
import { HTTPAction } from '../../core/services/offline-actions/offline-actions.model';

@Component({
  selector: 'pwa-product',
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
  standalone: true,
})
export class Product {
  // Injections
  private neonService = inject(Neon);
  protected networkService = inject(Network);
  protected storageService = inject(Storage);
  protected offlineActionsService = inject(OfflineActions);

  /** Reference to the `Search` component. */
  private readonly searchInputRef = viewChild<Search>('search');

  /** Holds all loaded products as a signal */
  protected readonly products = signal<ProductModel[]>([]);
  /** Current filter input value as a signal */
  private readonly filter = signal('');
  /** Whether the browser is connected to the internet or not */
  private readonly isOnline = computed(
    () => this.networkService.status() === Status.Online,
  );

  offlineActionsEffect = effect(() => {
    console.log(this.isOnline());
    if (
      this.isOnline() &&
      this.offlineActionsService.actionQueue().length === 0
    )
      return;
    
    console.log('Passed effect if');

    // Trigger the initialization of actions when back online, and there are actions in the queue.
    if (
      this.isOnline() &&
      this.offlineActionsService.actionQueue().length > 0
    ) {
      this.offlineActionsService.initiateActionExecuting();
      return;
    }
  });

  /**
   * Computed `MatTableDataSource` based on the current filter and products.
   *
   * Automatically re-computes when either `products` or `filter` changes.
   */
  dataSource = computed(() => {
    const all = this.products();
    const search = this.filter().toLowerCase().trim();

    if (!search) return new MatTableDataSource(all);

    const filtered = all.filter((product) =>
      Object.values(product).some((value) =>
        value?.toString().toLowerCase().includes(search),
      ),
    );

    return new MatTableDataSource(filtered);
  });

  /** Initializes the component by fetching products from the Neon service */
  ngOnInit(): void {
    this.neonService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => this.products.set(products));
  }

  /**
   * Applies a filter to the product list.
   * @param filterValue - The string to filter products by.
   */
  applyFilter(filterValue: string) {
    this.filter.set(filterValue);
  }

  /**
   * Resets the filter and clears the search input.
   */
  resetFilter() {
    this.filter.set('');
    this.searchInputRef()?.resetFilter();
  }

  /**
   * Handles update action for a product row
   * @param id - ID of the product to update
   */
  onUpdateRow(id: ProductModel['id']) {
    console.log(id);
  }

  /**
   * Handles delete action for a product row
   * @param id - ID of the product to delete
   */
  onDeleteRow(id: ProductModel['id']) {
    if (this.isOnline()) {
      // Procced with the actual call.
      // this.neonService.deleteProduct(id);
      console.log('Immediately call delete product.');
    } else {
      // Save action and optionally mutate local dataSource.
      // Note: If localDatasource is mutated the cached data will not also be updated, thus after a reload when offline,
      // we will still get the latest fetched data without local mutation.
      this.offlineActionsService.actionQueue.update((prev) => [
        ...prev,
        { id, action: HTTPAction.DELETE },
      ]);
      console.table(this.offlineActionsService.actionQueue);
    }
  }

  /**
   * Loads product data using `localStorage` as a custom caching fallback.
   *
   * ⚠️ Note: This method is only for demonstration purposes.
   *
   * The Angular Service Worker already handles caching automatically for: **"/api/products"**
   *
   * When the app is offline, Angular will serve the cached data from the service worker.
   * Therefore, this manual caching logic is not required in production.
   */
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
