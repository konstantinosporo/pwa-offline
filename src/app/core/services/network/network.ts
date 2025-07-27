import { inject, Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BehaviorSubject, fromEvent, map, merge, skip, startWith } from 'rxjs';
import { Settings } from '../../../features/shared/bottom-sheet/settings/settings';

@Injectable({
  providedIn: 'root',
})
export class Network {
  // Material bottom sheet.
  protected matBottomSheet = inject(MatBottomSheet);

  // About online/ offline status.
  // TODO THIS CAN ALSO BE DONE WITH SIGNALS CANT IT
  private onlineSubject = new BehaviorSubject('');
  /** Observable to listen to *network `events`*. */
  public network$ = this.onlineSubject.asObservable();

  // Whether the application should continue as offline mode.
  public offlineModeSubject = new BehaviorSubject(false);
  public offlineMode$ = this.offlineModeSubject.asObservable();

  /** Automatically close the `Online` popup after *2000* milliseconds */
  private readonly ONLINE_DISMISS_TIMEOUT = 2000;

  constructor() {
    this.monitorNetworkStatus();
  }

  /**
   * Sets up listeners for browser 'online' and 'offline' events,
   * opens a settings sheet on status change, and handles auto-dismissal.
   */
  private monitorNetworkStatus() {
    const online$ = fromEvent(window, 'online').pipe(
      map((value) => value.type),
    );

    const offline$ = fromEvent(window, 'offline').pipe(
      map((value) => value.type),
    );

    merge(online$, offline$)
      .pipe(startWith(navigator.onLine ? 'online' : 'offline'))
      .subscribe((status) => {
        this.onlineSubject.next(status);
        //this.matBottomSheet.open(Settings, { data: status });

        // Automatically remove offline mode when online.
        if (status === 'online') {
          this.offlineModeSubject.next(false);

          // Automatically close the `Online` popup.
          // setTimeout(() => {
          //   this.matBottomSheet.dismiss();
          // }, this.ONLINE_DISMISS_TIMEOUT);
        }
      });
  }
}
