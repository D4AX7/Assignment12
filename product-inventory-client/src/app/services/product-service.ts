//Sir if you want to use your own hosted backend, use the below code.

import { Product } from './../models/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://productsinventoryapi.azurewebsites.net/api/products';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string) {
    return this.http.post<any>('https://productsinventoryapi.azurewebsites.net/api/auth/login',
      { userName, password });
  }

  register(userName: string, password: string) {
    return this.http.post<any>('https://productsinventoryapi.azurewebsites.net/api/auth/register',
      { userName, password });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, this.getAuthHeaders());
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, this.getAuthHeaders());
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product, this.getAuthHeaders());
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}


//But if you would like to use my backend, use the below code.

// import { Product } from './../models/product';
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private apiUrl = 'http://localhost:5082/api/products';

//   constructor(private http: HttpClient) {}

//   login(email: string, password: string) {
//     return this.http.post<any>('http://localhost:5082/api/auth/login',
//       { email, password });
//   }

//   register(email: string, password: string) {
//     return this.http.post<any>('http://localhost:5082/api/auth/register',
//       { email, password });
//   }

//   private getAuthHeaders() {
//     const token = localStorage.getItem('token');
//     return { headers: { Authorization: `Bearer ${token}` } };
//   }

//   getProducts(): Observable<Product[]> {
//     return this.http.get<Product[]>(this.apiUrl, this.getAuthHeaders());
//   }

//   addProduct(product: Product): Observable<Product> {
//     return this.http.post<Product>(this.apiUrl, product, this.getAuthHeaders());
//   }

//   updateProduct(product: Product): Observable<Product> {
//     return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product, this.getAuthHeaders());
//   }

//   deleteProduct(id: number): Observable<Product> {
//     return this.http.delete<Product>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
//   }
// }