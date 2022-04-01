import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home/service/home.service';
import { UserRoom } from 'src/app/models/user-room.model';
let i = 0;

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit, AfterViewChecked{

  @Input() friend?: UserRoom;
  
  constructor() { 
  }
  ngAfterViewChecked(): void {
  
  }

  ngOnInit(): void {

  }

}
