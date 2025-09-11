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
  placeholder = input('Search..');
  width = input('100%');
  readonly inputRef = viewChild<ElementRef>('input');
  readonly changed = output<string>();

  protected emitFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.changed.emit(filterValue);
  }

  public resetFilter() {
    this.inputRef()!.nativeElement.value = '';
    this.changed.emit('');
  }
}
