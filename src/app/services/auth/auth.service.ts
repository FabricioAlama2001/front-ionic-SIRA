import {Injectable} from '@angular/core';
import {AuthModel, RoleModel} from "../../interfaces/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get accessToken(): string | null {
    let accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      accessToken = 'Bearer ' + accessToken.replace(/"/g, '');
    }

    return accessToken;
  }

  set accessToken(value: string) {
    sessionStorage.setItem('accessToken', JSON.stringify(value));
  }

  get auth(): AuthModel {
    return JSON.parse(String(sessionStorage.getItem('auth')));
  }

  set auth(auth: AuthModel | undefined | null) {
    sessionStorage.setItem('auth', JSON.stringify(auth));
  }

  get username(): string {
    return localStorage.getItem('username') ?? '';
  }

  set username(username: string) {
    localStorage.setItem('username', username);
  }

  get password(): string {
    return localStorage.getItem('password') ?? '';
  }

  set password(password: string) {
    localStorage.setItem('password', password);
  }

  get role(): RoleModel {
    return JSON.parse(String(sessionStorage.getItem('role')));
  }

  set role(role: RoleModel | undefined | null) {
    sessionStorage.setItem('role', JSON.stringify(role));
  }

  get roles(): RoleModel[] {
    return JSON.parse(String(sessionStorage.getItem('roles')));
  }

  set roles(roles: RoleModel[] | undefined | null) {
    sessionStorage.setItem('roles', JSON.stringify(roles));
  }
}
