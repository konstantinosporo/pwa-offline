import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'pwa-search',
  imports: [MatInputModule, MatFormFieldModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  /**
   * Initial placeholder on unfocused-unselected input.
   */
  placeholder = input('Search..');
  /**
   * The `input` reference.
   */
  readonly inputRef = viewChild<ElementRef>('input');
  /**
   * Event triggered when `input` value is changed.
   */
  readonly changed = output<string>();
  /**
   * Emits the query typed from user.
   * @param event
   */
  protected emitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.changed.emit(filterValue);
  }
  /**
   * Resets the search `input` element's value.
   */
  public resetFilter() {
    this.inputRef()!.nativeElement.value = '';
    this.changed.emit('');
  }
}
