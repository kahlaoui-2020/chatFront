import Dexie, {Table} from 'dexie';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';


export class ChatDB extends Dexie {
    friends!: Table<User, number>;
    messages!: Table<Message, string>;

    constructor() {
        super('');
        this.version(3).stores({
            friends: '++id',
            messages: '++id, messageId',
        });
    }
}
export const db = new ChatDB();