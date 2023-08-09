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