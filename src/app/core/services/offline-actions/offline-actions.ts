import { inject, Injectable, signal } from '@angular/core';
import { HTTPAction, OfflineAction } from './offline-actions.model';
import { Neon } from '../neon/neon';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfflineActions {
  // Injections
  private readonly neon = inject(Neon);
  /** Array containing all the pending actions to be executed when browser is back online. */
  public actionQueue = signal<OfflineAction[]>([]);

  initiateActionExecuting() {
    const actions = this.actionQueue();
    if (!actions.length) console.warn('No registered actions to be executed.');

    actions.forEach((action) => {
      switch (action.action) {
        case HTTPAction.DELETE:
          // console.log('Attempting to execute `DELETE` calls');
          this.neon
            .deleteProduct(action.id)
            .pipe(take(1))
            .subscribe({
              next: (product) => {
                this.actionQueue.set(actions.filter((a) => a.id !== action.id));
              },
              error: (err) => {
                console.log('Error deleting product.');
              },
            });
          break;
        case HTTPAction.PATCH:
          console.log('Attempting to execute `PATCH` calls');
          break;
      }
    });
  }
}
