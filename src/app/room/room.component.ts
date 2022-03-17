import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Message } from 'primeng/api';
import { HomeService } from '../home/service/home.service';
import { UserRoom } from '../models/user-room.model';
import { User } from '../models/user.model';
import { ChatService } from './service/chat.service';
import { MessageService } from './service/message.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {

  friend!: UserRoom;
  msg = new FormControl('')
  list: string[] = [];
  messages!: Message[];
  rooms: UserRoom[] = [];
  room: UserRoom = {};
  user: User = {};
  me: User;

  constructor(
    private chatService: ChatService, private homeService: HomeService, private messageService: MessageService) {
    this.me = JSON.parse(localStorage.getItem('user')!);
  }
  ngAfterViewChecked(): void {
    document.getElementById('scroll-div-1')!.scrollTop = document.getElementById('scroll-div-1')!.scrollHeight

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.friend) {
      this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
      console.log('log')
    }
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

  click() {
    console.log(this.room.messages!.length)
    console.log(this.friend.pagination)
  }
  onScroll() {
   
    if(this.friend.pagination!.skip > this.friend.pagination!.limit) {
      this.friend.pagination!.skip = this.friend.pagination!.skip - this.friend.pagination!.limit
      this.reloadMessage();
    }else if(this.friend.pagination!.skip < this.friend.pagination!.limit && this.friend.pagination!.skip != 0) {
      this.friend.pagination!.limit = this.friend.pagination!.skip;
      this.friend.pagination!.skip = 0;
      this.reloadMessage()
    }
  }
  reloadMessage() {
    console.log(this.friend.pagination);
    this.messageService
    .getMessages(this.friend.roomId!, this.friend.pagination!.limit, this.friend.pagination!.skip)
    .subscribe(
       data => {
      for (let d of data) {
        this.room.messages!.push(d)
      }
    });
  }
}
