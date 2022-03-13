import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient,) {}

  saveMessage(): void {

  }

  getMessages(id: any): Observable<Message[]> {

    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get<Message[]>('http://localhost:3000/messages', {params})
  }
}
