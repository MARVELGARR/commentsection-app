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
        body: JSON.stringify({ text })
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
    <div className=" w-full">
      <form onSubmit={createPost} className="flex w-full justify-start gap-5">
        <fielset className="flex w-full flex-col">

          <textarea  className=" h-24 w-full rounded-lg" onChange={(e)=>setText(e.target.value)} value={text} placeholder='Add a comment'></textarea>
          <div className='flex justify-between mt-5'>

            <img
              src={session?.user?.image}
              className=" w-12 h-12 rounded-full"
            />
            <button type="submit" className=" p-2 rounded-xl text-white bg-blue-950/80 w-24">Send</button>
          </div>
        </fielset>
      </form>
    </div>
  )
}

export default Post