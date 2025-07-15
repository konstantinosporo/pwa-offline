import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { Neon } from '../../core/services/neon/neon';
import { Network } from '../../core/services/network/network';
import { Storage } from '../../core/services/storage/storage';
import { ProductList } from './product-list/product-list';
import { ProductModel } from './models/product.model';
import { Search } from '../shared/search/search';
import { NoDataTemplate } from '../shared/templates/no-data-template/no-data-template';
import { SpinnerTemplate } from '../shared/templates/spinner-template/spinner-template';

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

  /** Reference to the `Search` component. */
  private readonly searchInputRef = viewChild<Search>('search');

  /** Holds all loaded products as a signal */
  protected readonly products = signal<ProductModel[]>([]);
  /** Current filter input value as a signal */
  private readonly filter = signal('');

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
      .subscribe((data: ProductModel[]) => {
        this.products.set(data);
      });
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
    console.log(id);
  }
}
