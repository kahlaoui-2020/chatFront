import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Room } from 'src/app/models/room.model';
import { UserRoom } from 'src/app/models/user-room.model';
import { User } from 'src/app/models/user.model';
import { ChatDbService } from 'src/app/services/chat.db.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  friends: EventEmitter<UserRoom[]> = new EventEmitter();
  rooms: UserRoom[] = [];
  listRooms: BehaviorSubject<UserRoom[]> = new BehaviorSubject<UserRoom[]>(this.rooms);
  friend: BehaviorSubject<UserRoom> = new BehaviorSubject<UserRoom>({});
  constructor(private http: HttpClient, private dbService: ChatDbService) {}

  getFriends(): void{
    // console.log('log')
    this.http.get<UserRoom[]>('http://localhost:3000/rooms')
    .subscribe(value => {
      // console.log('friends: ', value);
      this.rooms  = value.map(room => {
        var rObj: UserRoom = {};
        rObj.roomId = room.roomId;
        rObj.id = room.id;
        rObj.firstName = room.firstName;
        rObj.lastName = room.lastName;
        rObj.messages = []
        return rObj;});
    this.friend.next(this.rooms[0])
    this.friends.emit(this.rooms);
      //this.dbService.setFriend(value)
    })
  }

  addMessage(id: string, message: Message) {
    console.log('all rooms: ', this.rooms);
    const room = this.rooms.find((room: UserRoom )=> room.id === id);
    console.log('room: ', room);
    room!.messages!.push(message);
   // this.listRooms.next()friends.emit(this.rooms);
    //this.listRooms.next(this.rooms)
    this.friends.next(this.rooms)
    //console.log(this.listRooms.value)
    //this.listRooms.next();
  }

  getRoom(id: string): UserRoom {
    return this.rooms.find((room: UserRoom) => room.roomId === id)!
  }
}
