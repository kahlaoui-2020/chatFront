import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatDbService {

  constructor() { }

  async setFriend(friends: User[]) {
    await db.friends.bulkAdd(friends);
  }
}
