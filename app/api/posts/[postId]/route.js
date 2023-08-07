import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";

export async function GET(req){
    
    if(req.method){
        try{
            const content =  await prisma.post.findMany();
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

export async function PATCH(req, {params}){

    if(req.method){

        const content = await req.json();
        const { count, text } = content;
        const { postId } = params;
        
        if(count){

            try{
                    
                const updatePost = await prisma.post.update({
                    where:{
                        id: postId,
                    },
                    data:{
                        score: count
                    }                
                });
                if(!updatePost){
                    return NextResponse.json({message:"No score"},{status: 404})
                }
                return NextResponse.json(updatePost)
            }
            catch(error){
                return NextResponse.json({error:"Error updating score", error}, {status: 500})
            }
        }
        else if(text){
            try{
                const content = await req.json();
                const { text } = content;
                const { postId } = params;
                const updatePost = await prisma.post.update({
                    where:{
                        id: postId,
                    },
                    data:{
                        body: text
                    }                
                });
                if(!updatePost){
                    return NextResponse.json({message:"No body"},{status: 404})
                }
                return NextResponse.json(updatePost)
            }
            catch(error){
                return NextResponse.json({error:"Error updating body", error}, {status: 500})
            }

        }
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