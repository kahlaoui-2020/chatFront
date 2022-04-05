import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from '../home/service/home.service';
import { Message } from '../models/message.model';
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
  msg = new FormControl('', [Validators.required])
  list: string[] = [];
  messages: Message[] = [];
  rooms: UserRoom[] = [];
  room: UserRoom = {};
  user: User = {};
  me: User;

  currentRoom: User = {};

  constructor(
    private chatService: ChatService, 
    private homeService: HomeService, 
    private messageService: MessageService,
    private peerService: PeerService,
    private dialog: MatDialog) {
    this.me = JSON.parse(localStorage.getItem('user')!);
    //this.peerService.initPeer(this.me.id!)
    
  }
  ngAfterViewChecked(): void {
    document.getElementById('scroll-div-1')!.scrollTop = document.getElementById('scroll-div-1')!.scrollHeight

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (this.friend) {
      this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
    }
    if(this.currentRoom) {
      this.messages = [];
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    const call = this.peerService.peer.on("call", (call: any) => {
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
    call.on('close', () => {console.log('Media streaming was closed, mediaConnection')})
    this.homeService.friend.subscribe(value => {
      this.friend = value;
      this.room = this.homeService.getRoom(this.friend.roomId!)
      this.chatService.getMessage(this.friend.roomId!, this.friend.id!);
    });
    this.peerService.establishConnection(this.friend.id!);
    this.homeService.currentroomSubject.subscribe(value => {
    this.messages = []
      this.currentRoom = value;
      this.messageService.getMessages(this.currentRoom.roomId, 100, 0).subscribe(
        messages => {
         this.messages.push(...messages);
         console.log(messages)

      })
      
    })
  
  }
  send() {
    if(this.msg.valid)
      {
        this.chatService
          .sendMessage(this.me.id!, this.currentRoom.id!, this.currentRoom.roomId!, this.msg.value)
        this.messages.push({ content:this.msg.value, sender: this.me.id });
      }
      else console.log('msg is not valid')
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

id() {

  this.peerService.establishConnection(this.friend.id!)
}
}
