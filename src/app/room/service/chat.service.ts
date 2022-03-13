import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { HomeService } from 'src/app/home/service/home.service';
import { AuthService } from 'src/app/login/service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  count = 0;
  socket = io('http://localhost:3000', {
    extraHeaders: {
      Authorization: localStorage.getItem('token')!
    },
    autoConnect: false
  })

  messages = new EventEmitter<string>();
  users: any[] = []

  constructor(private auth: AuthService, private homeService: HomeService) { }

  public startConnection(): void {
      this.socket.auth = { username: JSON.parse(localStorage.getItem('user')!).firstName };
      this.socket.connect();
  }
  public sendMessage(sender: string, to: string, roomId: string,message: string) {
    this.socket.emit('message', {
      message,
      sender,
      to,
      roomId,
    });
    this.homeService.addMessage(roomId, {content: message, sender: sender});
  }
  public getMessage(idRoom: string, idFriend: string) {
    this.socket.off('message').on('message', (message: string, sender: string, roomId: any) => {
      console.log(roomId)
      this.homeService.addMessage(roomId, { content:message, sender });
    });
  }
  public getUsers() {
    this.socket.on('user-connected', (data: any) => {
      this.users.push(data);
    });
  }
  public onConnect(): void {
    this.socket.on('connect', () => {
      console.log(`New Connection ${++this.count}`)
    })
  }
  public onDisconnect(): void {
    this.socket.on('user disconnected', (data: any) => {
      console.log(`%s %c disconnected`, 'color: red', data)
    })
  }

}
