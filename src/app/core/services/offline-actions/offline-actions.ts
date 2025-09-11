import { inject, Injectable, signal } from '@angular/core';
import { HTTPAction, OfflineAction } from './offline-actions.model';
import { Neon } from '../neon/neon';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OfflineActions {
  private readonly neon = inject(Neon);

  public actionQueue = signal<OfflineAction[]>([]);
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

    return forkJoin(requests).pipe(
      tap(() => this.actionQueue.set([])),
      finalize(() => this.actionsFinished.set(true)),
    );
  }
}
