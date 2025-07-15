import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../features/product-list/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class Neon {
  private http = inject(HttpClient);
  private readonly neonApiUrl = 'https://node-api-jet.vercel.app/api';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.neonApiUrl}/products`);
  }
}
