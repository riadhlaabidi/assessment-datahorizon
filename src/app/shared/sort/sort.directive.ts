import { Directive, Input, output } from '@angular/core';

@Directive({
  selector: '[appSort]',
  standalone: true
})
export class SortDirective {

  @Input()
  predicate?: string;

  @Input()
  ascending?: boolean;

  constructor() { }

  predicateChange = output<string>();
  ascendingChange = output<boolean>();
  sortChange = output<{ predicate: string, ascending: boolean }>();

  sort(column: string) {
    // If sorting by a new column, set ascending to default "true", else
    // same column is clicked, so reverse current ascending order
    this.ascending = Object.is(this.predicate, column) ? !this.ascending : true;

    this.predicate = column;
    this.ascendingChange.emit(this.ascending);
    this.predicateChange.emit(this.predicate);
    this.sortChange.emit({ predicate: this.predicate, ascending: this.ascending });
  }

}
