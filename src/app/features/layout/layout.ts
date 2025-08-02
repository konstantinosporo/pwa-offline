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

@Component({
  selector: 'pwa-layout',
  imports: [
    RouterOutlet,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
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

  readonly isOnline = computed(() => this.network.status() === Status.Online);
  readonly actionQueue = computed(() => this.offlineActions.actionQueue());

  testCounter = 0;

  constructor() {
    effect(() => {
      if (this.isOnline() && this.actionQueue().length > 0) {
        this.snackbar.open('Syncing offline changes...', undefined, {
          duration: 3000,
        });

        console.log(`Triggered ${this.testCounter} times.`);
        this.testCounter = +1;

        this.offlineActions.initiateActionExecuting();
      }
    });
  }
}
