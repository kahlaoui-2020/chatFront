import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = null;
  constructor(private http: HttpClient, private router: Router) {}

  login(form: any): void {
    this.http.post<any>('http://localhost:3000/auth/login', form).subscribe({
      next: async (response) => {
        // this.token = response.access_token;
        localStorage.setItem('token', response.access_token);
        await this.router.navigate(['/room']);

      },
      error: (err) => console.log(err),
    });
   
  }
  user(): void {
    this.http.get<User>('http://localhost:3000/users/auth/me').subscribe({
      next: async (response) => {
        console.log(response)
        localStorage.setItem('user', JSON.stringify(response))
      },
      error: (err) => console.log(err),
    })
  }
}
