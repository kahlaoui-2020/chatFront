import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient,) {}

  saveMessage(): void {

  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>('http://localhost:3000/message')
  }
}
