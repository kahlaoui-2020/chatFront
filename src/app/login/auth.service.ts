import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = null;
  constructor(private http: HttpClient, private router: Router) {}

  login(form: any): void {
    this.http.post<any>('http://localhost:3000/auth/login', form).subscribe({
      next: async (response) => {
        this.token = response.access_token;
        await this.router.navigate(['/home']);

      },
      error: (err) => console.log(err),
    });
   
  }
}
