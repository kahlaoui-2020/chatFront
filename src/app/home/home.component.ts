import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { Message } from '../models/message.model';
import { UserRoom } from '../models/user-room.model';
import { User } from '../models/user.model';
import { ChatService } from '../room/service/chat.service';
import { PeerService } from '../room/service/peer.service';
import { HomeService } from './service/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges{

  @ViewChild('list') list!: MatSelectionList;
  friends: UserRoom[] = [];
  friend!: UserRoom;
  messages: Message[] = [];
  me: User;
  constructor(
    private homeService: HomeService, 
    private chatService: ChatService,
    private peerService: PeerService) { 
    // this.chatService.disconnect()
        this.chatService.startConnection();
        
        console.log(this.chatService.socket.auth, "Start new Connection!", this.chatService.socket.active);
      
      this.me = JSON.parse(localStorage.getItem('user')!);  
      
      this.peerService.initPeer(this.me.id!); 
      console.log('destroyed: ', peerService.peer.destroyed) 
      console.log('disconnected: ', peerService.peer.disconnected) 
    }
  ngOnChanges(changes: SimpleChanges): void {
   console.log('ng: ', this.peerService.peer)
  }

  ngOnInit(): void {
    


    this.chatService.getUsers();
    //this.chatService.onDisconnect();
    if(this.friends.length == 0) this.homeService.getFriends();
    
    this.homeService.friend.subscribe(value => {this.friend = value})
    this.homeService.friends.subscribe(value => {
      if(this.friends.length == 0) this.friends = value;
    });
  }

  openRoom(value: any): void {
    console.log(value);
    this.homeService.friend.next(value);

  }

}
