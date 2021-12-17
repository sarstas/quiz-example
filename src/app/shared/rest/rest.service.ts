import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { IResponse, ResponseStatus } from '@app/shared/rest/rest.interface';
import { RestFatalError } from '@app/shared/rest/errors/fatal-error';
import { IListItem } from '@app/shared/entities/list-item.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RestService {

  public note$: Subject<any> = new Subject();

  constructor(
    private _http: HttpClient,
  ) { }

  public restGET(endpoint: string, paramsData: IListItem[] = []): Observable<any> {
    let params = new HttpParams();

    paramsData.map((param: IListItem) => {
      if (param) {
        params = params.set(param.heading, param.value);
      }
    });

    const options = {
      params
    };

    return this._http.get(endpoint, options).pipe(
      map((data: IResponse) => this._toResponse(data))
    );
  }

  public restPOST(endpoint: string, body: any): Observable<any> {
    return this._http.post( endpoint, body).pipe(
      map((data: IResponse) => this._toResponse(data))
    );
  }

  private _toResponse(response: IResponse) {
    if (response.status === ResponseStatus.Success) {
      return response.data;
    }

    console.warn('Something went wrong', response);
    throw new RestFatalError(response.message);
  }
}
