import { Component, Input, OnInit } from '@angular/core';
import { UserRoom } from 'src/app/models/user-room.model';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {

  @Input() friend!: UserRoom;
  constructor() { }

  ngOnInit(): void {
  }

}
