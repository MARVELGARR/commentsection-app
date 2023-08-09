"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import Voters from './voter';
import Image from 'next/image';


function Feeds() {

    const [feeds, setFeeds] = useState([])
    const [ editText, setEditText] = useState({})
    const [editMode, setEditMode] = useState(true)
    const { data: session } = useSession({
        redirect: true,
        onUnauthenticated(){
          redirect("/login?callbackUrl=/")
        }
    })

    const editToggle = (postId) =>{
        setEditMode(!editMode)
        getPostBody(postId)
    }



    const getAllPost = async ()=>{
        try{

            const posts = await fetch("/api/posts", {
                method: "GET",
                headers:{
                    "content-type": "application/json"
                }
            })
            if (posts.ok) {
                const res = await posts.json();

                const formattedPosts = res.map((post) => {
                    const createdAtDate = parseISO(post.createdAt);
                    const formattedCreatedAt = formatDistanceToNow(createdAtDate, { addSuffix: true });

                    return { ...post, formattedCreatedAt };
                });

                setFeeds(formattedPosts);
                console.log("Posts have been retrieved");
            } else {
                console.log("Posts not found");
            }
        }
        catch(error){
            console.error("Error getting posts", error);
        }
    
    }


    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });
      
            if (response.ok) {
                const data = await response.json(); // Parse the response body as JSON
                console.log('Post was deleted successfully', data);
            } else {
                const errorData = await response.json(); // Parse the error response as JSON
                console.error('Failed to delete post', errorData);
            }
        } catch (error) {
          console.error('Error deleting post', error);
        }
    };

    const getPostBody = async (postId) =>{
        
        try{

            const post = await fetch(`/api/posts/${postId}`,{
                method: "GET",
                headers : {
                    "content-type" : "application/json"
                },
            })
            if(post.ok){
                const res = await post.json();
                const BODY = res.find((item)=> item.id == postId)?.body || "";
                setEditText({...editText, [postId]: BODY});
                
                console.log("post and  body gotten sucessfully ",res);
            }
            else{
                console.error("Error geting post and body", post.statusText)
            }
        }
        catch(error){
            console.error('Error getting post and body', error);
        }
    }

    const editPost = async (postId)=>{
    
        try{
            const post = await fetch(`/api/posts/${postId}`, {
                method: 'PATCH',
                headers:{
                    "content-type": "application/json",
                },
                body: JSON.stringify({ text })  
            })
            if(post.ok){
                const res = await post.json();
                setEditMode(false);
                console.log("post updated", res);
            }
            else{
                console.error("Error updating post", res.statusText);
            }
        }
        catch(error){
            console.error("Error updating post", error);
        }
    }
      

    
    useEffect(()=>{
        getAllPost();    
        
    },[])

    return (
        <>

          { editMode ? ( <div className="">
                <div className="flex flex-col gap-2 text-left">
                    { feeds.map((feed)=>{
                        return (
                            <div key={feed.id} className="flex w-full shadow-md px-4 py-2 rounded-xl  flex-col bg-white text-gray-900">
                                
                                <div className='flex gap-5 '>
                                    <img
                                        src={feed?.author?.image}
                                        className=' w-5 h-5 rounded-full'
                                    />
                                    <div className="">{feed?.author.name.split(" ")[0].trim()}</div>
                                    <div className="">{feed.formattedCreatedAt}</div>
                                </div>
                                <div className="mt-2">{feed.body}</div>
                                <div className='flex justify-between ml-5 items-center'>
                                    <div className="flex justify-between w-full -mb-5">

                                        <Voters postId={feed.id} />
                                        <div className="flex items-center gap-2">
                                            

                                            <button onClick={()=>deletePost(feed?.id)} className=" text-red-700 bg-slate-400/50 text-sm cursor-pointer rounded-lg p-2 flex items-center">
                                                <Image 
                                                    src="/images/delete.png"
                                                    height={140}
                                                    width={140}                    
                                                    className=" w-4 h-4"
                                                    alt="delete icon"
                                                />
                                                <span>Delete</span>
                                            </button>
                                            <div className=''>

                                                <button className="flex gap-2 cursor-pointer">

                                                    <img 
                                                        src="/svg/reply.svg"
                                                        className='w-5 h-5'
                                                        alt="reply icon"
                                                    />
                                                    <div className=' font-bold text-green-500'>Reply</div>
                                                </button>
                                                <button onClick={()=>editToggle(feed?.id)} className='flex items-center cursor-pointer'>
                                                    <Image
                                                        src="/images/edit.png"
                                                        alt="edit icon"
                                                        height={140}
                                                        width={140}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className=' font-bold text-blue-800'>Edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>):(
                <div className="flex w-full  py-2 rounded-xl  flex-col bg-white text-gray-900">
                { feeds.map((feed)=>{
                        return (
                            <div key={feed.id} className="flex w-full shadow-md px-4 py-2 rounded-xl  flex-col bg-white text-gray-900">
                                
                                <div className='flex gap-5 '>
                                    <img
                                        src={feed?.author?.image}
                                        className=' w-5 h-5 rounded-full'
                                    />
                                    <div className="">{feed?.author.name.split(" ")[0].trim()}</div>
                                    <div className="">{feed.formattedCreatedAt}</div>
                                </div>
                                <input className='' value={editText} onChange={(e)=>setEditText({ ...editText, [feed.id]: e.target.value })} />
                                <div className='flex justify-between ml-5 items-center'>
                                    <div className="flex justify-between items-center w-full -mb-5">

                                        <Voters postId={feed.id} />
                                        <button onClick={()=>editPost(feed?.id)} className=" h-10 p-2 text-sm text-white bg-blue-800 rounded-md cursor-pointer">Update</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default Feeds