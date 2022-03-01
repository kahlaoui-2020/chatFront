import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket = io('http://localhost:3000', {
    extraHeaders: {
      token: this.auth.token as unknown as string
    },
    autoConnect: false
  })
  
  messages = new EventEmitter<string>();
  
  constructor(private auth: AuthService) {}

  public startConnection(): void {
    // this.socket.auth = { this.auth.token };
    this.socket.connect();
  }
  public sendMessage(message: string) {
    this.socket.emit('message', message);
  }
  public getMessage() {
    this.socket.on('message', (message: string) => {
      this.messages.emit(message);
    });
  }
  public onConnect(): void {
    this.socket.on('connect', () => {
      console.log('Connected');
    })
  }
  public onDisconnect(): void {
    this.socket.on('disconnect', () => {
      console.log('Disconnected')
    })
  }

}
