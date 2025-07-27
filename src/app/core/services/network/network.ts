import { Injectable, signal } from '@angular/core';
import { fromEvent, map, merge, startWith } from 'rxjs';
import { Status } from './network.model';

@Injectable({
  providedIn: 'root',
})
export class Network {
  /** Browsers network status.*/
  public status = signal<Status>(Status.Offline);

  constructor() {
    this.monitorNetworkStatus();
  }

  /**
   * Sets up listeners for browser 'online' and 'offline' events,
   * opens a settings sheet on status change, and handles auto-dismissal.
   */
  private monitorNetworkStatus() {
    const online$ = fromEvent(window, 'online').pipe(
      map((value) => value.type as Status),
    );

    const offline$ = fromEvent(window, 'offline').pipe(
      map((value) => value.type as Status),
    );

    merge(online$, offline$)
      .pipe(startWith(navigator.onLine ? Status.Online : Status.Offline))
      .subscribe((status: Status) => {
        this.status.set(status);
      });
  }
}
