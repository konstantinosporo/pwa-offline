import { Component } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'pwa-tab',
  imports: [MatTabsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './tab.html',
  styleUrl: './tab.scss',
})
export class Tab {
  links = [
    { label: 'Home', path: '' },
    { label: 'Products', path: 'products' },
    { label: 'Settings', path: 'test' },
  ];

  activeLink = this.links[0];

  log(args: MatTabChangeEvent) {
    console.log(args);
  }
}
