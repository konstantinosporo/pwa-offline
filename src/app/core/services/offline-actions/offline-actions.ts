import { inject, Injectable, signal } from '@angular/core';
import { HTTPAction, OfflineAction } from './offline-actions.model';
import { Neon } from '../neon/neon';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OfflineActions {
  private readonly neon = inject(Neon);

  /** All pending actions */
  public actionQueue = signal<OfflineAction[]>([]);

  /** Notifies when all actions are done */
  public actionsFinished = signal(false);

  initiateActionExecuting() {
    const actions = this.actionQueue();
    if (!actions.length) {
      console.warn('No registered actions to be executed.');
      return;
    }

    const requests = actions.map((action) => {
      switch (action.action) {
        case HTTPAction.DELETE:
          return this.neon.deleteProduct(action.id).pipe(
            tap(() => {
              // remove from queue on success
              this.actionQueue.set(
                this.actionQueue().filter((a) => a.id !== action.id),
              );
            }),
            catchError((err) => {
              console.error('Error deleting product', err);
              // swallow error so other requests can finish
              return of(null);
            }),
          );
        default:
          return of(null);
      }
    });

    forkJoin(requests).subscribe({
      next: () => {
        console.log('All offline actions finished.');
        this.actionsFinished.set(true); // signal to reload UI
      },
    });
  }
}
