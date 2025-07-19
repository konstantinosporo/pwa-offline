import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'pwa-spinner-template',
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner-template.html',
  styleUrl: './spinner-template.scss',
})
export class SpinnerTemplate {
  /** Message rendered under the spinner. */
  message = input('Loading..');
  /** Height of the component expected to be rendered. */
  height = input('');
}
