import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text",  },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> { 
                await dbConnect()
                try {
                  const user =  await UserModel.findOne({
                        $or: [
                          { emai: credentials.identifier },
                          { username: credentials.identifier }, 
                      ]
                  })  
                  if(!user) {
                    throw new Error("No user found with provided credentials")
                    }
                    if (!user.isVerified) {
                        throw new Error('verify your account befor login')
                    }
                    const isCorrectPass = await bcrypt.compare(credentials.password, user.password);
                    if (isCorrectPass) {
                        return user;
                    } else {
                        throw new Error("email or password is not valid")
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
          },
        async jwt({ token, user }) {
            if (user) {
                //modifying token response
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
              }
            return token
          }   
    },
    pages: {
        signIn: '/sign-in',
      
    },
    session: {
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRETE_KEY
} 