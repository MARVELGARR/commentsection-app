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
            await prisma.vote.deleteMany({
                where:{
                    commentId:commentId
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

    
    if (req.method === 'PATCH') {
        const { commentId } = params;
        const content = await req.json();
        const { state, comment } = content;
        
        try {
            const session = await getServerSession(authOptions);

            const user = await prisma.user.findUnique({
                where: {
                  email: session?.user?.email
                }
            })
            if (!user) {
                return NextResponse.json({ message: 'User not found' });
            }

            if( state !== undefined ) {
                
                const existingVote = await prisma.vote.findFirst({
                    where: {
                        userId: user?.id,
                        commentId: commentId
                    }
                })

                if(!existingVote) {
                    await prisma.vote.create({
                        data: {
                            upVote: state,
                            userId: user.id,
                            commentId: commentId,
                        },
                    });
                    
                    const newVote = await prisma.vote.findFirst({
                        where: {
                            userId: user.id,
                            commentId: commentId
                        }
                    })
                    if(newVote.upVote == true){   
                        await prisma.comment.update({
                            where: {
                                id: commentId,
                            },
                            data: {
                                score: {
                                    increment: 1,
                                },
                            },
                        });
                    }
                    else if( newVote.upVote == false){
                        
                        await prisma.comment.update({
                            where: {
                                id: commentId,
                            },
                            data: {
                                score: {
                                    decrement: 1,
                                },
                            },
                        });
                        
                    }
                    else{
                        return NextResponse.json({message: "Invalid state"})
                    }
                    return NextResponse.json({ existingVote })
                }

                if(existingVote && existingVote.upVote === state){
                    return NextResponse.json({message: "Cannot vote the same direction"})
                }
                const scoreIncrement = existingVote.upVote === state ? 0 : (state ? 1 : -1);
                await prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        score: {
                            increment: scoreIncrement,
                        },
                    },
                });
                
                await prisma.vote.update({
                    where: {
                        id: existingVote.id,
                    },
                    data: {
                        upVote: state,
                    },
                });
                
                const message = state ? "upVote" : "downVote";
                return NextResponse.json({ message });

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
            return NextResponse.json({ error: "Error updating comment", message: error.message }, { status: 500 });
        }
    }   
    else {
      return NextResponse.error(405, "Method Not Allowed");
    }
}