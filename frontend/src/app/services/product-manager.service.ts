import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductManagerService {

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(environment.SERVER_URL + '/products');
  }
}
