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

  /** Fetch `ProductModel[]` from the API. */
  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.neonApiUrl}/products`);
  }
  /** Delete a product from the API. */
  deleteProduct(id: ProductModel['id']) {
    return this.http.delete<ProductModel>(`${this.neonApiUrl}/products/${id}`);
  }
}
