import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
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
            const { commentId } = params
            await prisma.comment.delete({
                where:{
                    id: commentId
                }
            })
            return new NextResponse(
                { message: 'comment deleted successfully' },
                { status: 200 })
        }
        catch(error){
            return new NextResponse(
                { error: 'Error deleting comment' },
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
        const { commentId } = params;

        if(!session){
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const content = await req.json();
        const { commentReply } = content;

        const parentComment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        })
        if(!parentComment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        const post = await prisma.post.findUnique({
            where:{
                id: parentComment.postId
            }
        })
        
        const user = await prisma.user.findUnique({
            where: {
                email : session?.user?.email
            }
        })

        const newComment = await prisma.comment.create({
            data: {
                comment: commentReply,
                user: { connect: { id: user?.id } },
                post: { connect: { id: parentComment.postId } },
                parentReply: { connect: { id: parentComment.id } },
            },
        })
        return NextResponse.json(newComment)
    }
    catch(error){
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Error replying to comment", details: error.message }, { status: 500 });
    }

}

export async function PATCH(req, { params }) {

    const session = await getServerSession(authOptions);
    
    if (req.method === 'PATCH') {
        const { commentId } = params;
        const content = await req.json();
        const { count, comment } = content;
  
        try {
            if (count !== undefined) {
                const updatePost = await prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        score: count,
                    },
                });

                if (!updatePost) {
                    return NextResponse.json({ message: "No score found" }, { status: 404 });
                }
        
                return NextResponse.json(updatePost);
            } 
            else if (comment !== undefined) {
                const updatePost = await prisma.comment.update({
                    where: {
                    id: commentId,
                    },
                    data: {
                    comment: comment,
                    },
                });

                if (!updatePost) {
                    return NextResponse.json({ message: "No body found" }, { status: 404 });
                }

                return NextResponse.json(updatePost);
            } 
            else {
                return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error: "Error updating post", message: error.message }, { status: 500 });
        }
    }   
    else {
      return NextResponse.error(405, "Method Not Allowed");
    }
}