import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  /**
   * Persists information in `LocalStorage`.
   * @param key The property name.
   * @param data Data to be saved under the property name.
   */
  save(key: string, data: any, saveWithTimeStamp = false) {
    if (saveWithTimeStamp) {
      const dataWithTimeStamp = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(dataWithTimeStamp));
    } else localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Retrieves a persisted dataSet via `key`.
   * @param key The property name.
   * @returns * **Success** - Parsed data.
   *          * **Error** - { message: string, error: any }
   */
  get(key: string) {
    const raw = localStorage.getItem(key);

    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (error) {
        return { message: 'Something went wrong', error };
      }
    }
  }

  /**
   * Remove a specified row from `LocalStorage`.
   * @param key The property name.
   */
  delete(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Totally clears `LocalStorage`, by removing all key/pair values.
   */
  clear() {
    localStorage.clear();
  }
}
