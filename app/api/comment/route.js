import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export async function POST(req){

    const content =  await req.json();
    const { comment, postId, commentReply, commentId } = content;
    const session = await getServerSession(authOptions)
    
    try{
        if(!session){
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: session?.user?.email
            }
        })
        if (!user) {

            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if( comment && postId !== undefined){

            const newPost = await prisma.comment.create({
                data: {
                    comment: comment,
                    userId: user.id,
                    postId: postId,
                },
            })
            if(!newPost){
                return NextResponse.json({ error: "could not finde comment"}, {stateus: 404})
            }
            return NextResponse.json(newPost)
        }
        else if(commentReply && commentId !== undefined){
            const newComment = await prisma.comment.create({
                data: {
                    comment: commentReply,
                    userId: user.id,
                    postId: commentId,
                },
            })
            if(!newComment){
                return NextResponse.json({ error:" Comment not created"},{status: 404})
            }
            return NextResponse.json(newComment)
        }
        else{
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }
    }
    catch(error){
        console.error("Error creating comment:", error);
        return NextResponse.json({error:"Error creating comment", error}, {status: 500})
    }
}

export async function GET(req){
    
    if(req.method){
        try{
            const content =  await prisma.comment.findMany({
                include:{
                    user: true,
                    post: {
                        include:{
                            author: true
                        }
                    }
                }
            });
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