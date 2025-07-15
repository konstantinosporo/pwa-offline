import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { Neon } from '../../core/services/neon/neon';
import { Network } from '../../core/services/network/network';
import { Storage } from '../../core/services/storage/storage';
import { Product } from './models/product.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-product-list',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  standalone: true,
})
export class ProductList {
  // Inject services
  private neonService = inject(Neon);
  protected networkService = inject(Network);
  protected storageService = inject(Storage);

  // Signals
  products = signal<Product[]>([]);
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

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'quantity',
    'category',
    'image_url',
    'created_at',
    'updated_at',
    'discount',
  ];

  ngOnInit(): void {
    this.neonService
      .getProducts()
      .pipe(take(1))
      .subscribe((data: Product[]) => {
        this.products.set(data);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.set(filterValue);
  }
}
