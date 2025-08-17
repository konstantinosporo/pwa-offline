import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { OfflineActions } from '../../core/services/offline-actions/offline-actions';
import { WelcomeCard } from './welcome-card/welcome-card';

@Component({
  selector: 'pwa-home',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    WelcomeCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly offlineActions = inject(OfflineActions);

  readonly pendingActions = computed(
    () => this.offlineActions.actionQueue().length,
  );
}
