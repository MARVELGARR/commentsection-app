import { prisma } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const { authorId } = req.query;

  try {
    // Fetch the user data from the database based on the authorId
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (user) {
      // User data found, return it as JSON response
      NextResponse.json({message:"user data found",data:user},{status:200});
    } else {
      // User data not found for the given authorId
      NextResponse.json({message:"user data not found"},{status:404});
    }
  } catch (error) {
    // Handle any errors that occur during the database query or processing
    console.error('Error getting user data', error);
    NextResponse.json({message:"Error getting user data"},{status:500});
  }
}