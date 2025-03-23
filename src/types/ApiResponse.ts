import {Message} from '@/model/User.model.ts'
export interface ApiResponse {
    success:boolean;
    message:strin;
    isAcceptingMessages?: boolean;
    messages?:Arrat<Message>
}