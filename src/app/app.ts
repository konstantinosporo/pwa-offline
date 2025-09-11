import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Update } from './core/services/sw/update/update';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private swUpdate = inject(Update);

  constructor() {
    this.swUpdate.updateApp();
  }
}
