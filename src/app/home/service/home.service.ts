import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { UserRoom } from 'src/app/models/user-room.model';
import { MessageService } from 'src/app/room/service/message.service';
import { ChatDbService } from 'src/app/services/chat.db.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  friends: EventEmitter<UserRoom[]> = new EventEmitter();
  rooms: UserRoom[] = [];
  listRooms: BehaviorSubject<UserRoom[]> = new BehaviorSubject<UserRoom[]>(this.rooms);
  friend: BehaviorSubject<UserRoom> = new BehaviorSubject<UserRoom>({});
  constructor(private http: HttpClient, private dbService: ChatDbService, private messageService: MessageService) {}

  getFriends(): void{
    this.http.get<UserRoom[]>('http://localhost:3000/rooms')
    .subscribe(value => {
      this.rooms  = value.map((room, index) => {
        var rObj: UserRoom = {};
        rObj.roomId = room.roomId;
        rObj.id = room.id;
        rObj.firstName = room.firstName;
        rObj.lastName = room.lastName;
        rObj.messages = [];

        rObj.pagination = {
          msgCount: room.msgCount!,
          limit: 15,
          skip: (room.msgCount! - 15) <= 0 ? 0: (room.msgCount! - 15),
        };
        this.messageService.getMessages(
          room.roomId, 
          rObj.pagination.limit, rObj.pagination.skip)
          .subscribe(value => {
            for(let message of value) {
             // console.log('message: ', message);
             rObj.messages!.push(message);
          }
         })
        return rObj;
      });
    this.friend.next(this.rooms[0])
    this.friends.emit(this.rooms);

      //this.dbService.setFriend(value)
    })
  }

  addMessage(id: string, message: Message) {
    console.log('all rooms: ', this.rooms);
    const room = this.rooms.find((room: UserRoom )=> room.roomId === id);
    console.log('room: ', room);
    room!.messages!.push(message);
    this.friends.next(this.rooms);

  }

  getRoom(id: string): UserRoom {
    return this.rooms.find((room: UserRoom) => room.roomId === id)!
  }
}
