import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { UserRoom } from 'src/app/models/user-room.model';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/room/service/message.service';
import { ChatDbService } from 'src/app/services/chat.db.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  friends: EventEmitter<UserRoom[]> = new EventEmitter();
  rooms: UserRoom[] = [];
  /*
  new implementation
  */
  myrooms: User[] = [];
  myroomsSubject: Subject<UserRoom[]> = new Subject<UserRoom[]>();
  currentroom: UserRoom = {};
  currentroomSubject: Subject<User> = new Subject<User>();

  /*******************************/

  listRooms: BehaviorSubject<UserRoom[]> = new BehaviorSubject<UserRoom[]>(this.rooms);
  friend: BehaviorSubject<UserRoom> = new BehaviorSubject<UserRoom>({});
  constructor(private http: HttpClient, private dbService: ChatDbService, private messageService: MessageService) {}

  getFriends(): void{
    this.http.get<UserRoom[]>('http://localhost:3000/rooms')
    .subscribe((value: any[]) => {
      this.rooms  = value.map((room: { roomId: string | undefined; id: string | undefined; firstName: string | undefined; lastName: string | undefined; msgCount: number; }, index: any) => {
        var rObj: UserRoom = {};
        rObj.roomId = room.roomId;
        rObj.id = room.id;
        rObj.firstName = room.firstName;
        rObj.lastName = room.lastName;
        rObj.messages = [];
        rObj.active = false

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

  /** */
  getMyRooms(): void {
    this.http.get<User[]>('http://localhost:3000/rooms')
    .subscribe( {
      next:  (value: User[]) => { 
        this.myrooms = value;
        this.myroomsSubject.next(this.myrooms);
        this.emitCurrentRoom(value[0]);
      },
      error: (err: any) => {
        throw err
      }
    })
  }

  emitCurrentRoom(room: User): void {
    this.currentroomSubject.next(room)  
  }
  /******** */
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

  activateUser(id: string, active: boolean) {
   (this.rooms.find((room: UserRoom) => room.id === id))!.active = active;
  }
}
