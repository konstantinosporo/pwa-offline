import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take, throttleTime } from 'rxjs';
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

  createProduct(product: ProductModel) {
    return this.http.post<ProductModel>(`${this.neonApiUrl}/products`, product);
  }

  /** Generates dummy data on the API for testing offline actions. */
  generateProducts(amount = 10) {
    for (let i = 0; i < amount; i++) {
      const product: ProductModel = { name: 'Delete', price: 100 };

      setTimeout(() => {
        this.http
          .post(`${this.neonApiUrl}/products`, product)
          .pipe(take(1))
          .subscribe();
      }, 3000);
    }
  }
}
