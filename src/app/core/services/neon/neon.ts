import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from '../../../features/product/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class Neon {
  private http = inject(HttpClient);
  private readonly neonApiUrl = 'https://node-api-jet.vercel.app/api';

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.neonApiUrl}/products`);
  }
}
