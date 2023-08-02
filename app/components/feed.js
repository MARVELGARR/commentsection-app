"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';

function Feeds() {

    const [feeds, setFeeds] = useState([])
    const { data: session } = useSession({
        redirect: true,
        onUnauthenticated(){
          redirect("/login?callbackUrl=/")
        }
    })

    const getAllPost = async ()=>{
        try{

            const posts = await fetch("/api/posts", {
                method: "GET",
                headers:{
                    "content-type": "application/json"
                }
            })
            if(posts.ok){
                const res = await posts.json();
                setFeeds(res);
                
                console.log("Post have been retrieved")
            }
            else{
                console.log("posts not found");
            }
    
        }
        catch(error){
            console.error("Error getting posts", error);
        }
    
    }
    const getPosts = ()=>{
        
        const formattedPosts = feeds.map((post) => {
            const createdAtDate = parseISO(post.createdAt);
            const formattedCreatedAt = formatDistanceToNow(createdAtDate, { addSuffix: true });
            return { ...post, formattedCreatedAt };
        });
        return formattedPosts;
    }
 

    useEffect(()=>{
        getAllPost();
        getPosts();
        
    },[])

    return (
    <div className="">
        <div>
        </div>
        { feeds.map((feed)=>{
            return (
                <div key={feed.id} className="flex flex-col items-center">
                    <div className='flex items-center'>
                        <img
                            src={feed?.author?.image}
                            className=' w-5 h-5 rounded-full'
                        />
                        <div className="">{feed?.author.name}</div>
                        <div className="">{feed.createdAt}</div>
                    </div>
                    <div className="">{feed.body}</div>
                </div>
            )
        })}
    </div>
    )
}

export default Feeds