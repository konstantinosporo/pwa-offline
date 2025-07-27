import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tab } from './features/shared/navigation/tab/tab';
import { Neon } from './core/services/neon/neon';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Network } from './core/services/network/network';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tab, JsonPipe, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Injections
  private readonly neon = inject(Neon);
  private readonly networkService = inject(Network);

  protected readonly data = this.neon.getProducts();

  constructor() {
    this.networkService.network$.subscribe((value) => {
      console.log(value);
    });
  }
}
