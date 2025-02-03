import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from "./auth.service";
import {LoginModel} from "../../interfaces/auth";
import {LoginResponse} from "../../interfaces/http-response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL: string = `${environment.API_URL}/auth`;
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
  }

  login(credentials: LoginModel): Observable<LoginResponse> {
    const url = `${this.API_URL}/login`;

    return this.httpClient.post<LoginResponse>(url, credentials)
      .pipe(
        map(response => {
          this.authService.accessToken = response.data.accessToken;
          this.authService.auth = response.data.auth;
          this.authService.username = response.data.auth.username;
          this.authService.password = credentials.password;
          this.authService.roles = response.data.auth.roles;
          return response;
        })
      );
  }

  logOut(){
    // sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
