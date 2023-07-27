import bcrypt from "bcrypt"
import { prisma } from "@/app/lib/db/db"
import { NextResponse } from "next/server"

export async function POST(req){
    const body = await req.json();
    const { name, email, password } = body

    if(!name || !email || !password){
        return NextResponse.json({ error:"Missing required fields"}, {status: 400})
    }

    try{
        const exist = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(exist){
            return NextResponse.json({error:"Email already exist"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                
                name,
                email,
                hashedPassword,
            }
        })
        return NextResponse.json(user);

    }
    catch (error) {
        console.error("error creating user", error);
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
}