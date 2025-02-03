import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {CatalogueModel} from "../interfaces/core";
import {ServerResponse} from "../interfaces/http-response";
@Injectable({
  providedIn: 'root'
})
export class CataloguesHttpService {
  private readonly API_URL = `${environment.API_URL}/catalogues`;
  private readonly httpClient = inject(HttpClient);

  constructor() {
  }


  findCataloguesByTypes(type: string): Observable<CatalogueModel[]> {
    const url =`${this.API_URL}/types/${type}`;
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        sessionStorage.setItem('catalogues', JSON.stringify(response.data));
        return response.data;
      })
    );
  }
}
