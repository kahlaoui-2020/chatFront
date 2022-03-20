import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'primeng/api';
import { HomeService } from '../home/service/home.service';
import { UserRoom } from '../models/user-room.model';
import { User } from '../models/user.model';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, OnChanges {

  friend!: UserRoom;
  msg = new FormControl('')
  list: string[] = [];
  messages!: Message[];
  rooms: UserRoom[] = [];
  room: UserRoom = {};
  user: User = {};
  me: User;
  constructor(
    private chatService: ChatService, private homeService: HomeService) {
    this.me = JSON.parse(localStorage.getItem('user')!);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.friend) this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  this.homeService.friend.subscribe(value => {
    this.friend = value;
    this.room = this.homeService.getRoom(this.friend.roomId!)
    this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
  })
  }
  send() {
    this.chatService.sendMessage(this.me.id!, this.friend.id!, this.friend.roomId!, this.msg.value)
  }

}
