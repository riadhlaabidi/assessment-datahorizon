import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sort-svg',
  standalone: true,
  imports: [],
  templateUrl: './sort-svg.component.svg',
  styleUrl: './sort-svg.component.css'
})
export class SortSvgComponent {
  @Input()
  type?: string;
}
