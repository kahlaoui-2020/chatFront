import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/service/home.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-list-of-rooms',
  templateUrl: './list-of-rooms.component.html',
  styleUrls: ['./list-of-rooms.component.scss']
})
export class ListOfRoomsComponent implements OnInit {

  myrooms: User[] = [];
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.myroomsSubject.subscribe(rooms => this.myrooms = rooms);
  }



  openRoom(value: any): void {
    console.log(value);
    this.homeService.emitCurrentRoom(value);

  }

}
