import 'next-auth';
import { DefaultSession } from 'next-auth';

//redefining existing types of next-auth;

declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages: boolean;
        username?: string;

    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages: boolean;
            username?: string;
 
        } & DefaultSession['user']
    }
}
//optionally you can change module interface like this 
//here we are redefining jwt
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
            isVerified?: boolean;
            isAcceptingMessages: boolean;
            username?: string;
    }
}