"use client"
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

function Comments() {
    const session = useSession()
    const [comment, setComment] = useState("")

    const createComment = async (e) =>{
        e.preventDefault();
        try{
            const comments = await fetch("/api/comment",{
                method: "POST",
                headers:{
                    "content-type": "application/json"
                },
                body: JSON.stringify({ comment })
            })
            if(comments.ok){
                toast.success("Replied successfull")
                const res = await comments.json()
                console.log("commented successfully", res)
            }
            else{
                toast.error("Failed to reply")
                console.error("reply not sent", comment.statusText)
            }
        }
        catch(error){
            toast.error("something went wrong")
            console.error("something went wrong",error)
        }
    }

  return (
    <div>
        <div className=' flex gap-2'>
            <img 
                src={session?.user?.image}
                className='w-8 h-8 rounded-full'
                alt="profile image"
            />
            <form onSubmit={createComment} className="flex w-full justify-start gap-5">
                <fieldset className="flex w-full">
                    <textarea  className=" h-14 w-full rounded-lg" onChange={(e)=>setComment(e.target.value)} value={comment} placeholder='Add a comment'></textarea>
                    <div className='flex mt-5 items-start'>

                        <button type="submit" className=" p-2 rounded-xl text-white bg-blue-950/80 w-14">Reply</button>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
  )
}

export default Comments