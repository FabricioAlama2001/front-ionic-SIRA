import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers ? request.headers : new HttpHeaders();

    if (this.authService.accessToken) {
      headers = headers.set('Authorization', `${this.authService.accessToken.replace(/"/g, '')}`);
    }

    return next.handle(request.clone({ headers }));
  }
}
