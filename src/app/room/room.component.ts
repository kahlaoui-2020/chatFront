import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { HomeService } from '../home/service/home.service';
import { AuthService } from '../login/service/auth.service';
import { Room } from '../models/room.model';
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

    // this.homeService.friends.subscribe(rooms => {
    //   var room = rooms.find(room => room.roomId === this.friend.roomId);
    //   console.log(0, room)
    //   this.room = room!;
    //   this.room.messages = [];
    // })

  this.homeService.friend.subscribe(value => {
    this.friend = value;
    this.room = this.homeService.getRoom(this.friend.roomId!)
    this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
  })
  
    this.homeService.friends.subscribe(rooms => {
      // this.rooms = rooms; 
      this.room = rooms.find(room => room.id === this.friend.id)!;
      console.log('On a changé room!')
      // console.log(0, rooms)
      // var room = rooms.find(room => room.roomId === this.friend.roomId); /** */
      // var message = room!.messages![room!.messages!.length - 1]; /** */
      // this.room.id = room!.id
      // if (this.room.messages === undefined) { this.room.messages = []; }
      // this.room.messages.push(message);
    })
  }
  send() {
    this.chatService.sendMessage(this.me.id!, this.friend.id!, this.friend.roomId!, this.msg.value)
  }

}
