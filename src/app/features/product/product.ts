import { Component, computed, inject, signal } from '@angular/core';
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

@Component({
  selector: 'pwa-product',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    ProductList,
    Search,
  ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
  standalone: true,
})
export class Product {
  // Inject services
  private neonService = inject(Neon);
  protected networkService = inject(Network);
  protected storageService = inject(Storage);

  // Signals
  products = signal<ProductModel[]>([]);
  filter = signal('');

  // Computed data source
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

  ngOnInit(): void {
    this.neonService
      .getProducts()
      .pipe(take(1))
      .subscribe((data: ProductModel[]) => {
        this.products.set(data);
      });
  }

  applyFilter(filterValue: string) {
    this.filter.set(filterValue);
  }

  onUpdateRow(id: ProductModel['id']) {
    console.log(id);
  }

  onDeleteRow(id: ProductModel['id']) {
    console.log(id);
  }
}
