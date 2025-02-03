import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {AttendanceModel, CatalogueModel} from "../interfaces/core";
import {ServerResponse} from "../interfaces/http-response";

@Injectable({
  providedIn: 'root'
})
export class AttendanceHttpService {
  private readonly API_URL = `${environment.API_URL}/attendances`;
  private readonly httpClient = inject(HttpClient);

  constructor() {
  }

  register(employeeId: string, type: CatalogueModel): Observable<AttendanceModel> {
    const url = `${this.API_URL}/${employeeId}/register`;
    return this.httpClient.post<ServerResponse>(url, {type}).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  // Obtener todas las asistencias
  findAttendancesByEmployee(employeeId: string, startedAt: Date, endedAt: Date): Observable<AttendanceModel[]> {
    const url = `${this.API_URL}/${employeeId}/current`;

    const params = new HttpParams()
      .append('startedAt', startedAt.toDateString())
      .append('endedAt', endedAt.toDateString());

    return this.httpClient.get<ServerResponse>(url,{params}).pipe(
      map(response => response.data)
    );
  }


}
