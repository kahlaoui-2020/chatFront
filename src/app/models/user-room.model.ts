import { Message } from "./message.model";

export interface UserRoom {
    id?:string;
    lastName?: string;
    firstName?: string;
    roomId?: string;
    messages?: Message[];
    msgCount?: number;
    pagination?: {
        msgCount: number;
        limit: number;
        skip: number;
    }
    active?: boolean;
}