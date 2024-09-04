import { AfterContentInit, ContentChild, Directive, Host, HostListener, Input } from '@angular/core';
import { SortDirective } from './sort.directive';
import { SortSvgComponent } from './sort-svg/sort-svg.component';

@Directive({
  selector: '[appSortBy]',
  standalone: true,
})
export class SortByDirective implements AfterContentInit {

  @Input()
  appSortBy!: string;

  @ContentChild(SortSvgComponent, { static: false })
  sortSvgComponent?: SortSvgComponent;

  defaultSort = "";
  sortDesc = "down";
  sortAsc = "up";

  constructor(private sort: SortDirective) {
    sort.predicateChange.subscribe(() => this.updateIcon());
    sort.ascendingChange.subscribe(() => this.updateIcon());
  }

  @HostListener('click')
  onClick(): void {
    if (this.sortSvgComponent) {
      this.sort.sort(this.appSortBy);
    }
  }

  ngAfterContentInit(): void {
    this.updateIcon();
  }

  updateIcon() {
    if (this.sortSvgComponent) {
      let sortType = this.defaultSort;
      if (this.sort.predicate == this.appSortBy) {
        sortType = this.sort.ascending ? this.sortAsc : this.sortDesc;
      }
      this.sortSvgComponent.type = sortType;
    }
  }


}
