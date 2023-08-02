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
        const { text } = content;
        const user = await prisma.user.findUnique({
            where: {
                email: session?.user?.email
            }
        })
        if (!user) {

            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const newPost = await prisma.post.create({
            data: {
                body: text,
                authorId: user.id,
            },
        })
        return NextResponse.json(newPost)
    }
    catch(error){
        console.error("Error creating post:", error);
        return NextResponse.json({error:"Error creating post", error}, {status: 500})
    }
}

export async function GET(){

    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({error:"User not authenticated"}, {status:401})
        }
        else{

            const allPost = await prisma.post.findMany({
                include:{
                    author: true,
                }
            })
            return NextResponse.json(allPost)
        }

    }
    catch(error){
        console.error("Error Getting Posts", error);
        return NextResponse.json({ error: 'Error getting posts' }, { status: 500 })
    }
}