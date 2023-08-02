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
          <fielset className="flex flex-col">

            <textarea  className=" w-full rounded-lg" onChange={(e)=>setText(e.target.value)} value={text}></textarea>
            <div className='flex justify-between mt-5'>

              <img
                src={session?.user?.image}
                className="w-10 h-10 rounded-full"
              />
              <button type="submit" className=" p-2 rounded-xl text-white bg-cyan-950">Send</button>
            </div>
          </fielset>
        </form>
    </div>
  )
}

export default Post