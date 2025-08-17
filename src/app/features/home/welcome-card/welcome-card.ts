import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pwa-welcome-card',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    RouterModule,
  ],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.scss',
})
export class WelcomeCard {
  styles = input({
    width: '100%',
    height: '100%',
  });
  pendingActions = input(0);
}
