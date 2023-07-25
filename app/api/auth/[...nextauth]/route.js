import NextAuth from "next-auth/next";
import { prisma } from "@/app/lib/db/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { CredentialsProvider } from "next-auth/providers";
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
        CredentialProvider({
            name: "credentials",
            Credentials : {
                email : { label: "Email", type: "string", placeholder: "marvellous obatale"},
                password : { label: "Password", type: "password" },
                username : { label: "username", type: "string", placeholder: "marvel"}
            },
            async authorize(credentials){
                const user = { id:1, name: "John", email: "john@hmail.com"}
            }
        })
    ],
    secrete: process.env.SECRETE,
    secssion:{
        strategy:"jwt",
    },
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}