import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export async function POST(req){

    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        const content =  await req.json();
        const { comment, postId } = content;
        const user = await prisma.user.findUnique({
            where: {
                email: session?.user?.email
            }
        })
        if (!user) {

            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const newPost = await prisma.comment.create({
            data: {
                comment: comment,
                userId: user.id,
                postId: postId,
            },
        })
        return NextResponse.json(newPost)
    }
    catch(error){
        console.error("Error creating comment:", error);
        return NextResponse.json({error:"Error creating comment", error}, {status: 500})
    }
}

export async function GET(req){
    
    if(req.method){
        try{
            const content =  await prisma.comment.findMany();
            return NextResponse.json(content)
        }
        catch(error){
            console.error("Error Getting Comments", error);
            return NextResponse.json({ error: 'Error getting Comments' }, { status: 500 })
        }
    }
    else{
        console.error("Error Getting Comments", error);
        return NextResponse.error(405, 'Method Not Allowed');
    }
}