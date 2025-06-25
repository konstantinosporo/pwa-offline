import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Neon {
  private http = inject(HttpClient);
  private neonApiUrl = 'https://node-api-jet.vercel.app/api';

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.neonApiUrl}/products`);
  }
}
