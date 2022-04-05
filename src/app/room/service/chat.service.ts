import { Injectable } from '@angular/core';
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
  users: any[] = []

  constructor(private auth: AuthService, private homeService: HomeService) { }

  public async startConnection(): Promise<void> {
      this.socket.auth = { 
        username: JSON.parse(localStorage.getItem('user')!).firstName,
      };
      this.socket.connect();

      
  }
  public sendMessage(sender: string, to: string, roomId: string,message: string): Promise<void> {
    const event = this.socket.emit('message', {
      message,
      sender,
      to,
      roomId,
    })
    return Promise.resolve()
  }
  public getMessage(idRoom: string, idFriend: string) {
    this.socket.off('message').on('message', (message: string, sender: string, roomId: any) => {
      this.homeService.addMessage(roomId, { content:message, sender });
    });
  }
  public getUsers() {
    this.socket.on('user-connected', (data: any) => {
    // this.homeService.activateUser(data.frienId, true)
    });
  }
  public onConnect(): void {
    this.socket.on('connect', () => {

    })
  }
  public onDisconnect(): void {
    this.socket.on('user disconnected', (data: any) => {
      //this.homeService.activateUser(data.frienId, false)
    })
  }

  public disconnect(): void {
    this.socket.disconnect()
  }
}
