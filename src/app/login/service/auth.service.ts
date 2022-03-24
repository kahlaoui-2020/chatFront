import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = null;
  constructor(private http: HttpClient, private router: Router) { }

  login(form: any): void {
    this.http.post<any>('http://localhost:3000/auth/login', form).subscribe({
      next: async (response) => {
        localStorage.setItem('token', response.access_token);
        this.user();
        await this.router.navigate(['/home']);


      },
      error: err => {
        throw err

      }
    });

  }
  user(): void {
    this.http.get<User>('http://localhost:3000/users/auth/me').subscribe({
      next: async (response) => {
        localStorage.setItem('user', JSON.stringify(response))
      },
      error: (err) => console.log(err),
    })
  }
  create(form: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/auth/sign-up', form)
  }

  activate(key: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/auth/activate', key)
  }
}
