import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from '../employee.model';

export type EntityArrayResponseType = HttpResponse<IEmployee[]>;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  protected resourceUrl = "https://retoolapi.dev/HYd96h/data";

  constructor(private http: HttpClient) { }

  query(opts?: any): Observable<EntityArrayResponseType> {
    const options = this.createRequestOptions(opts);
    return this.http.get<IEmployee[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  private createRequestOptions(opts?: any): HttpParams {
    let options: HttpParams = new HttpParams();

    if (opts) {
      Object.keys(opts).forEach(key => {
        if (opts[key] && opts[key] !== '') {
          options = options.append(key, opts[key])
        }
      });
    }
    console.log(options);
    return options;
  }



}
