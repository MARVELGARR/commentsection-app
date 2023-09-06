import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export async function GET(req){
    
    if(req.method === "GET"){ //checks if the request method is a get request
        try{
            const content =  await prisma.post.findMany({ // An ORM is used to retrieve all the posts including their comments
                include:{
                    comments: true
                }
            });
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

export async function PATCH(req, { params }) {

    
    if(req.method === 'PATCH') {
        
        try {
            const session = await getServerSession(authOptions)
           
            const { text,  state  } = await req.json();
            const { postId } = params
            const user = await prisma.user.findUnique({
                where: {
                  email: session?.user?.email
                }
            })
            if (!user) {
                return NextResponse.json({ message: 'User not found' });
            }
            
            if (text !== undefined) {
                const updatePost = await prisma.post.update({
                    where: {
                    id: postId,
                    },
                    data: {
                    body: text,
                    },
                });

                if (!updatePost) {
                    return NextResponse.json({ message: "No body found" }, { status: 404 });
                }

                return NextResponse.json(updatePost);
            }
            else if( state !== undefined ) {
                
                const existingVote = await prisma.vote.findFirst({
                    where: {
                        userId: user?.id,
                        postId: postId
                    }
                })
                if(!existingVote) {
                    await prisma.vote.create({
                        data: {
                            upVote: state,
                            userId: user.id,
                            postId: postId,
                        },
                    });
                    const newVote = await prisma.vote.findFirst({
                        where: {
                            userId: user.id,
                            postId: postId
                        }
                    })
                    if(newVote.upVote == true){   
                        await prisma.post.update({
                            where: {
                                id: postId,
                            },
                            data: {
                                score: {
                                    increment: 1,
                                },
                            },
                        });
                    }
                    else if( newVote.upVote == false){
                        
                        await prisma.post.update({
                            where: {
                                id: postId,
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
                await prisma.post.update({
                    where: {
                        id: postId,
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
            else {
                return NextResponse.json({ message: "No vote found" }, { status: 400 });
            }
        } catch (error) {
            return NextResponse.json({ error: "Error updating post", message: error }, { status: 500 });
        }
    } 
    else {
      return NextResponse.error(405, "Method Not Allowed");
    }
}

export async function DELETE(req, { params }){
    
    if(req.method === "DELETE"){
        try{
            const { postId } = params
            await prisma.post.delete({
                where:{
                    id: postId
                },
                include: {
                    comments: true
                }
            })
            await prisma.comment.deleteMany({
                where: {
                  postId,
                },
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