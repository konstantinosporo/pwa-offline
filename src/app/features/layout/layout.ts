import { NgClass } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Network } from '../../core/services/network/network';
import { Status } from '../../core/services/network/network.model';
import { OfflineActions } from '../../core/services/offline-actions/offline-actions';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'pwa-layout',
  imports: [
    RouterOutlet,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private readonly network = inject(Network);
  private readonly offlineActions = inject(OfflineActions);
  private readonly snackbar = inject(MatSnackBar);
  private readonly observer = inject(ViewportRuler);

  readonly isOnline = computed(() => this.network.status() === Status.Online);
  readonly actionQueue = computed(() => this.offlineActions.actionQueue());

  protected readonly isMobile = toSignal(
    this.observer.change(10).pipe(
      startWith(null),
      map(() => this.observer.getViewportSize().width < 600),
    ),
    { initialValue: false },
  );

  constructor() {
    effect(() => {
      if (this.isOnline() && this.actionQueue().length > 0) {
        this.snackbar.open('Syncing offline changes...', undefined, {
          duration: 3000,
        });

        this.offlineActions.initiateActionExecuting();
      }
    });
  }
}
