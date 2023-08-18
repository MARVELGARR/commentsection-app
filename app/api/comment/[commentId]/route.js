import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";


export async function GET(req){

    
    if(req.method){
        try{
            const content =  await prisma.comment.findMany();
            return NextResponse.json(content)
        }
        catch(error){
            console.error("Error Getting Post", error);
            return NextResponse.json({ error: 'Error getting posts' }, { status: 500 })
        }
    }
    else{
        console.error("Error Getting Post", error);
        return NextResponse.error(405, 'Method Not Allowed');
    }
}


export async function DELETE(req, { params }){
    
    if(req.method){
        try{
            const { postId } = params
            await prisma.post.delete({
                where:{
                    id:postId
                }
            })
            return new NextResponse(
                { message: 'Post deleted successfully' },
                { status: 200 })
        }
        catch(error){
            return new NextResponse(
                { error: 'Error deleting post' },
                { status: 500 }
            )
        }
    }
    else{
        console.error("Error Deleting Post", error);
        return NextResponse.error(405, 'Method Not Allowed');
    }
}

export async function POST(req, { params }){
    
    try{
        
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const content = await req.json();
        const { commentReply, commentId } = content;

        const parentComment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        })
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newComment = await prisma.comment.create({
            data: {
                comment: commentReply,
                userId: user.id,
                postId: commentId,
            },
        })
        return NextResponse.json(newComment)
    }
    catch(error){
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Error replying to comment", details: error.message }, { status: 500 });
    }

}