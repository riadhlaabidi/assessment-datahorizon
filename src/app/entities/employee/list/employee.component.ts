import { Component, OnInit } from '@angular/core';
import { ASC, DESC, ITEMS_PER_PAGE, ITEMS_PER_PAGE_CHOICES, ITEMS_PER_PAGE_PARAM, ORDER_PARAM, PAGE_PARAM, SORT_PARAM, TOTAL_COUNT_RESPONSE_HEADER } from '../../../config/pagination.constants';
import { IEmployee } from '../employee.model';
import { EmployeeService, EntityArrayResponseType } from '../service/employee.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { SortSvgComponent } from '../../../shared/sort/sort-svg/sort-svg.component';
import { SortDirective } from '../../../shared/sort/sort.directive';
import { SortByDirective } from '../../../shared/sort/sort-by.directive';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CurrencyPipe, SortSvgComponent, SortDirective, SortByDirective],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  employees?: IEmployee[];
  isLoading = false;

  predicate = 'firstName';
  ascending = true;

  itemsPerPageSelected = ITEMS_PER_PAGE;
  itemsPerPageChoices = ITEMS_PER_PAGE_CHOICES;
  totalEmployeesCount = 0;
  page = 1;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.route.queryParamMap.pipe(
      tap((params) => this.fillAttributesFromRoute(params)),
      switchMap(() => this.queryBanckend())
    ).subscribe({
      next: (res: EntityArrayResponseType) => {
        console.log("Getting data");
        this.totalEmployeesCount = Number(res.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
        this.employees = res.body ?? [];
      }
    });
  }

  onSelectItemsPerPage(e: Event): void {
    const value = +(e.target as HTMLSelectElement).value;
    this.itemsPerPageSelected = value;
    this.handleNavigation();
  }

  deleteEmployee(id: number) {
    this.employees = this.employees?.filter(emp => emp.id !== id);
  }

  handleNavigation(): void {
    const queryParams: any = {
      [PAGE_PARAM]: this.page,
      [ITEMS_PER_PAGE_PARAM]: this.itemsPerPageSelected,
      [SORT_PARAM]: this.predicate,
      [ORDER_PARAM]: this.ascending ? ASC : DESC
    }

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams
    });
  }

  private queryBanckend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;

    const queryParams: any = {
      [PAGE_PARAM]: this.page,
      [ITEMS_PER_PAGE_PARAM]: this.itemsPerPageSelected,
      [SORT_PARAM]: this.predicate,
      [ORDER_PARAM]: this.ascending ? ASC : DESC
    }

    return this.employeeService.query(queryParams).pipe(tap(() => this.isLoading = false));
  }

  private fillAttributesFromRoute(params: ParamMap) {
    const page = params.get(PAGE_PARAM);
    this.page = +(page ?? 1);

    const itemsPerPage = params.get(ITEMS_PER_PAGE_PARAM);
    this.itemsPerPageSelected = +(itemsPerPage ?? ITEMS_PER_PAGE);

    const sort = params.get(SORT_PARAM) ?? 'firstName';
    this.predicate = sort;

    const order = params.get(ORDER_PARAM);
    this.ascending = (order ?? ASC) === ASC;
  }
}
