import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from "./auth.service";
import {LoginModel, UserModel} from "../../interfaces/auth";
import {LoginResponse, ServerResponse} from "../../interfaces/http-response";
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

  login(credentials: LoginModel): Observable<UserModel> {
    const url = `${this.API_URL}/login`;

    return this.httpClient.post<LoginResponse>(url, credentials)
      .pipe(
        map(response => {
          this.authService.accessToken = response.data.accessToken;
          this.authService.auth = response.data.auth;
          this.authService.username = response.data.auth.username;
          this.authService.password = credentials.password;
          this.authService.roles = response.data.auth.roles;
          return response.data.auth;
        })
      );
  }

  logOut(){
    // sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  changePassword(id: string, credentials: any): Observable<ServerResponse> {
    const url = `${this.API_URL}/${id}/change-password`;

    return this.httpClient.put<ServerResponse>(url, credentials).pipe(
      tap(() => {
        console.log('🔑 Contraseña cambiada correctamente');
      }),
      catchError((error) => {
        console.error('❌ Error al cambiar la contraseña:', error);
        return throwError(error);
      })
    );
  }
  changePasswordFirst(id: string, credentials: any): Observable<ServerResponse> {
    const url = `${this.API_URL}/${id}/change-password-first`;

    return this.httpClient.put<ServerResponse>(url, credentials).pipe(
      tap(() => {
        console.log('🔑 Contraseña cambiada correctamente');
      }),
      catchError((error) => {
        console.error('❌ Error al cambiar la contraseña:', error);
        return throwError(error);
      })
    );
  }

  requestVerificationCode(username: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/transactional-codes/${username}/request`;

    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => response), // Retorna la respuesta del backend
      catchError((error) => {
        console.error('❌ Error al solicitar el código:', error);
        return throwError(error);
      })
    );
  }

  verifyVerificationCode(token: string, username: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/transactional-codes/${token}/verify`;

    return this.httpClient.patch<ServerResponse>(url, { username }).pipe(
      map(response => response), // Retorna la respuesta del backend
      catchError((error) => {
        console.error('❌ Error al verificar el código:', error);
        return throwError(error);
      })
    );
  }

  resetPassword(username: string, newPassword: string): Observable<ServerResponse> {
    const url = `${this.API_URL}/reset-passwords`;

    const payload = {
      username,
      passwordNew: newPassword
    };

    return this.httpClient.patch<ServerResponse>(url, payload).pipe(
      map(response => response),
      catchError((error) => {
        console.error('❌ Error al cambiar la contraseña:', error);
        return throwError(error);
      })
    );
  }


}
