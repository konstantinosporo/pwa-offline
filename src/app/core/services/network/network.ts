import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, mapTo, merge, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Network {
  private onlineSubject = new BehaviorSubject(false);
  public network$ = this.onlineSubject.asObservable();

  constructor() {
    this.monitorNetworkStatus();
  }

  private monitorNetworkStatus() {
    const online$ = fromEvent(window, 'online').pipe(map((value) => !!value));
    const offline$ = fromEvent(window, 'offline').pipe(map((value) => !!value));

    merge(online$, offline$)
      .pipe(startWith(navigator.onLine))
      .subscribe((status) => this.onlineSubject.next(status));
  }
}
