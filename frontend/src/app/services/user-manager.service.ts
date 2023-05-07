import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  constructor(private http: HttpClient) { }

  isUserLoggedIn() {
    return this.http.get(environment.SERVER_URL + '/users/status');
  }

  login(username: String, password: String) {
    return this.http.post(environment.SERVER_URL + '/users/login', { username: username, password: password }, { responseType: 'text' });
  }

  register(username: String, password: String, email: String) {
    return this.http.post(environment.SERVER_URL + '/users/register', { username: username, password: password, email: email }, { responseType: 'text' });
  }

  logOut() {
    return this.http.post(environment.SERVER_URL + '/users/logout', { }, { responseType: 'text' });
  }
}
