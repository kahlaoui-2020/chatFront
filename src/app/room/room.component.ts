import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../login/auth.service';
import { User } from '../models/user.model';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {


  msg = new FormControl('')
  list: string[] = [];

  constructor(private chatService: ChatService, private auth: AuthService) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

    console.log(JSON.parse(localStorage.getItem('user')!))

    this.chatService.startConnection();
    this.chatService.getMessage()
    this.chatService.onConnect();
    this.chatService.onDisconnect();

    this.chatService.messages.subscribe(message => {
      this.list.push(message)
    })

  }
  send() {
    this.chatService.sendMessage(this.msg.value)
  }

}
