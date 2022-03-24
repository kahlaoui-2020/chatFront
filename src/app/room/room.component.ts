import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Message } from 'primeng/api';
import { HomeService } from '../home/service/home.service';
import { UserRoom } from '../models/user-room.model';
import { User } from '../models/user.model';
import { VideoRoomComponent } from '../shared/video-room/video-room.component';
import { ChatService } from './service/chat.service';
import { MessageService } from './service/message.service';
import { PeerService } from './service/peer.service';


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
    private chatService: ChatService, 
    private homeService: HomeService, 
    private messageService: MessageService,
    private peerService: PeerService,
    private dialog: MatDialog) {
    this.me = JSON.parse(localStorage.getItem('user')!);
    this.peerService.initPeer(this.me.id!)
    // console.log(this.me);
    
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
    this.peerService.onListening()
    this.peerService.peer.on("call", (call) => {
      if(confirm(`Accept call from ${call.peer}`)) {
        const dialogRef = this.dialog.open(VideoRoomComponent, {
          data:{
            call: call,
            answer: true,
            }
          });
        dialogRef.afterClosed().subscribe(() => {
          console.log('dialog closed')
        })
      }
    })
    this.homeService.friend.subscribe(value => {
      this.friend = value;
      this.room = this.homeService.getRoom(this.friend.roomId!)
      this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
    });
    this.peerService.establishConnection(this.friend.id!)
  }
  send() {
    this.chatService.sendMessage(this.me.id!, this.friend.id!, this.friend.roomId!, this.msg.value)
  }

  connect() {

    this.peerService.initPeer(this.me.id!)
  }
  call() {
    const dialogRef = this.dialog.open(VideoRoomComponent, {
      data: {
        id: this.friend.id
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      console.log('end call')
    })
   
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

attach_file(): void {

}
attach_audio(): void {
  
}
attach_emoji(): void {
  
}
}
