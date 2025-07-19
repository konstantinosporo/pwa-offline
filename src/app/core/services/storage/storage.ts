import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  public key = signal<string>('');
  public REFRESH_DATA = 0.1; // minutes

  private readonly LOCAL_KEY = 'cached-data-key';

  constructor() {
    const savedKey = localStorage.getItem(this.LOCAL_KEY);
    this.key.set(savedKey ?? this.generateNewKey());
  }

  private generateNewKey(): string {
    return Math.random().toString();
  }

  updateKey() {
    const newKey = this.generateNewKey();
    this.key.set(newKey);
    localStorage.setItem(this.LOCAL_KEY, newKey);
    
  }
  /**
   * Persists information in `LocalStorage`.
   * @param key The property name.
   * @param data Data to be saved under the property name.
   */
  save(key: string, data: any, saveWithTimeStamp = false) {
    if (saveWithTimeStamp) {
      const dataWithTimestamp = {
        data,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Retrieves a persisted dataSet via `key`.
   * @param key The property name.
   * @returns * **Success** - Parsed data.
   *          * **Error** - { message: string, error: any }
   */
  get<T>(key: string): T | undefined {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  checkForCachedData<T>(key: string): Observable<T> {
    if (!key) {
      console.warn('Key is required to access LocalStorage.');
      return throwError(() => new Error('Invalid key.'));
    }

    const data = this.get<T>(key);
    if (data) {
      return of(data);
    }

    return throwError(() => new Error('No data found in LocalStorage.'));
  }

  hasExpired(date: string, thresholdMinutes = this.REFRESH_DATA): boolean {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diffInMinutes = (now - then) / (1000 * 60);
    return diffInMinutes >= thresholdMinutes;
  }
}
