import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req){

    try{
        const content =  await req.json();
        const { body } = content;
        const newPost = await prisma.post.create({
            data:{
                body,
            }
        })
        return NextResponse.json(newPost)
    }
    catch(error){
        console.error("Error creating post:", error);
        return NextResponse.json({error:"Error creating post", error}, {status: 500})
    }
}