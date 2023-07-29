import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";

export async function POST(req){

    try{
        const session = await getSession({req});

        if(!session?.user?.email){
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        const content =  await req.json();
        const { body } = content;
        const user = await prisma.post.findUnique({
            where: {
                email: session.user.email
            }
        })
        if (!user) {

            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const newPost = await prisma.post.create({
            data:{
                body,
                author:{
                    connect:{
                        id: user.id,
                    }
                }
            }
        })
    }
    catch(error){
        console.error("Error creating post:", error);
        return NextResponse.json({error:"Error creating post", error}, {status: 500})
    }
}