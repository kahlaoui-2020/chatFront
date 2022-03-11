import { Timestamp } from "rxjs";

export interface Message {
    id?: number;
    sender?: string;
    content?: string;
    creationDate?: Timestamp<Date>;
    roomId?: string;
}