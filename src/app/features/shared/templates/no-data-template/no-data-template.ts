import { Component, input, output } from '@angular/core';

@Component({
  selector: 'pwa-no-data-template',
  imports: [],
  templateUrl: './no-data-template.html',
  styleUrl: './no-data-template.scss',
})
export class NoDataTemplate {
  /** Message rendered under the `icon` */
  message = input('No results found.');
  /** Icon rendered on top of `message` */
  icon = input('📦');

  /** Event triggered when the `icon` is clicked */
  iconClicked = output<void>();
}
