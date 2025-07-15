import { Component, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'pwa-search',
  imports: [MatInputModule, MatFormFieldModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  readonly changed = output<string>();

  protected emitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.changed.emit(filterValue);
  }
}
