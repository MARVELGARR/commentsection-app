"use client"
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'



function Post() {

  const { data: session } = useSession({
    redirect: true,
    onUnauthenticated(){
      redirect("/login?callbackUrl=/")
    }
  })
  const [text, setText] = useState("")
  const accessToken = session?.account?.access_token;
  const createPost =  async (e)=>{
    e.preventDefault();

    try{

      const newPost = await fetch("/api/posts",{
        method: "POST",
        headers: { 
          "content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({text})
      })
      if(newPost.ok){
        const res = await newPost.json();
        console.log("post was created successfully", res);
      }
      else{
        console.error("Failed to create post", newPost.statusText);
      }
    }
    catch(error){
      console.error("Error creating post:", error);
    }
  }

  return (
    <div className="">
        <form onSubmit={createPost} className="flex justify-start gap-5">

            <img
              src={session?.user?.image}
              className="w-10 h-10 rounded-full"
            />
            <textarea onChange={(e)=>setText(e.target.value)} value={text} className=""></textarea>
            <button type="submit" className=" p-2 rounded-xl text-white bg-cyan-950">Send</button>
        </form>
    </div>
  )
}

export default Post