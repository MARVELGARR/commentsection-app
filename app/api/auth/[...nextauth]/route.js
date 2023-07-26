import NextAuth from "next-auth/next";
import { prisma } from "@/app/lib/db/db";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github" 

export const authOptions = {
    
    adapter: PrismaAdapter(prisma),
    providers:[
        GitHubProvider({
            clientId:process.env.GITHUB_ID,
            clientSecret:process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId:process.env.GITHUB_ID,
            clientSecret:process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials : {
                email : { label: "Email", type: "string", placeholder: "marvellous obatale"},
                password : { label: "Password", type: "password" },
                username : { label: "username", type: "string", placeholder: "marvel"}
            },
            async authorize(credentials){
                const user = { id:1, name: "John", email: "john@hmail.com"}
                return user;
            }
        }),
    ],
    secret: process.env.SECRETE,
    session:{
        strategy:"jwt",
    },
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}