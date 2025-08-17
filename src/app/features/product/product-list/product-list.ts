import { Component, input, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductModel } from '../models/product.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'pwa-product-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  dataSource = input<MatTableDataSource<ProductModel, MatPaginator>>();

  toggleSearch = output<void>();
  refresh = output<void>();
  update = output<ProductModel['id']>();
  delete = output<ProductModel['id']>();

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'quantity',
    'category',
    'actions',
  ];
}
