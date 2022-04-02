import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
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
export class HomeComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('list') list!: MatSelectionList;
  @ViewChild('drawer') drawer!: MatDrawer;
  friends: UserRoom[] = [];
  friend!: UserRoom;
  messages: Message[] = [];
  me: User;
  opened: boolean = true;
  constructor(
    private homeService: HomeService,
    private chatService: ChatService,
    private peerService: PeerService,
    private router: Router) {
    this.chatService.startConnection();

    this.me = JSON.parse(localStorage.getItem('user')!);

    //this.peerService.initPeer(this.me.id!);
    // console.log('destroyed: ', peerService.peer.destroyed)
    // console.log('disconnected: ', peerService.peer.disconnected)
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
  //  console.log(this.chatService.socket.auth, "Start new Connection!", this.chatService.socket.active, this.chatService.socket.id );
  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log('ng: ', this.peerService.peer)
  }

  logout(): void {
    this.router.navigate(['']).then(() => {
      localStorage.clear();
      sessionStorage.clear();
    })
  }

  ngOnInit(): void {

    let i = 0;
    this.peerService.initPeer(this.me.id!)
    this.chatService.getUsers();
    this.chatService.onDisconnect();
    this.chatService.onConnect();
    if (this.friends.length == 0) this.homeService.getFriends();

    this.homeService.friend.subscribe(value => {this.friend = value })
    this.homeService.friends.subscribe(value => {
      if (this.friends.length == 0) this.friends = value;
    });



    
    
   
  }

  openRoom(value: any): void {
    console.log(value);
    this.homeService.friend.next(value);

  }

}
