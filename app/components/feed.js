"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import Voters from './voter';
import Image from 'next/image';
import { getAllPost } from './getAllPost';
import { getAllComments } from './getAllPost';
import { toast } from 'react-hot-toast';
import Comments from './comments';
import Testing from './texting';


function Feeds() {

    const [feeds, setFeeds] = useState([])
    const [comments, setComments] = useState([])
    const [ editText, setEditText] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [comment, setComment] = useState("")
    const { data: session } = useSession({
        redirect: true,
        onUnauthenticated(){
          redirect("/login?callbackUrl=/")
        }
    })
    const [text, setText] = useState("")
    const [currentlyEditedPostId, setCurrentlyEditedPostId] = useState(null); // Add this state
    const accessToken = session?.account?.access_token;
    const [replyMode, setReplyMode] = useState(true)
    const [currentlyReplyingCommentId, setCurrentlyReplyingCommentId] = useState(null)



    const fetchData = async () => {
      const formattedPosts = await getAllPost(); // Call the getAllPost function in an async function
      setFeeds(formattedPosts); // and set it to the feed state
    };

    const fetchComment = async () =>{
        const formattedComments = await getAllComments(); // Call the getAllComment function
        setComments(formattedComments); // and set it to the
        console.log(" my comment",comments)
    }

    useEffect(() => {
        fetchData();
        fetchComment();
    }, []); // useEffect used to fetch the all users post/ feeds after when the component mount 


    //toggle between editmmode
    const editToggle = (postId) => {
        if (currentlyEditedPostId == postId) {
            setCurrentlyEditedPostId(null); // Turn off edit mode for this post
            setEditMode(false);
        } else {
            setEditMode((prev)=> !prev); // Enable edit mode
            getPostBody(postId);
            setCurrentlyEditedPostId(postId); // Set the currently edited post ID
        }
    };

    const replyToggle = (commentId) => {
        
        if(currentlyReplyingCommentId === commentId) {
            setReplyMode((prev)=>!prev);
            console.log(replyMode);
            setCurrentlyReplyingCommentId(commentId); //
        }
        else{
            setReplyMode((prev)=>!prev);
            console.log(replyMode);
            setCurrentlyReplyingCommentId(commentId);
        }
    }

    // function that works with the postroute and  handles the deleting of a specific post based on the post id
    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });
      
            if (response.ok) {
                fetchData(); // if the deleting of the post was successful re call all the posts
                toast.success("post deleted successfully");
                const data = await response.json(); // Parse the response body as JSON
                console.log('Post was deleted successfully', data); //console log the result
            } else {
                const errorData = await response.json();
                toast.error(" Post failed to delete") // Parse the error response as JSON
                console.error('Failed to delete post', errorData);
            }
        } catch (error) {
            toast.error("something went wrong")
          console.error('Error deleting post', error);
        }
    };

    const getPostBody = (postId) =>{       
        const BODY = feeds.find((item)=> item.id == postId)?.body || "";
        setEditText({...editText, [postId]: BODY});
        
    }

    const editPost = async (postId)=>{
    
        try{
            const post = await fetch(`/api/posts/${postId}`, {
                method: 'PATCH',
                headers:{
                    "content-type": "application/json",
                },
                body: JSON.stringify({ text: editText[postId] }), // Use the correct body property here  
            })
            if(post.ok){
                fetchData();
                toast.success("Post updated successfully")
                setEditMode((prev)=> !prev)
                const res = await post.json();
                console.log("post updated", res);
            }
            else{
                toast.error("Error updating post")
                console.error("Error updating post", post.statusText);
            }
        }
        catch(error){
            toast.error("something went wrong")
            console.error("Error updating post", error);
        }
    }

    const createPost = async (e) => {
        e.preventDefault();
        try {
          const newPost = await fetch('/api/posts', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ text }),
          });
          if (newPost.ok) {
            toast.success("Poast created successfully")
            fetchData()
            setText("")
            const res = await newPost.json();
            console.log('post was created successfully', res);

          } else {
            toast.success("Error creating post")
            console.error('Failed to create post', newPost.statusText);
          }
        } catch (error) {
            toast.error("something went wrong")
            console.error('Error creating post:', error);
        }
    };

    const createComment = async (e, postId) =>{
        e.preventDefault();
        try{
            const comments = await fetch("/api/comment",{
                method: "POST",
                headers:{
                    "content-type": "application/json"
                },
                body: JSON.stringify({ comment, postId })
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
        <div className='flex flex-col gap-4'>
            <div className="flex flex-col gap-3">

                {feeds.map((feed) => {
                    return (
                        <div key={feed.id} className="flex w-full shadow-md px-4 py-2 rounded-xl flex-col bg-white text-gray-900">
                            <div className='flex gap-5'>
                                <img
                                    src={feed?.author?.image}
                                    className='w-7 h-7 rounded-full'
                                    alt="Author Avatar"
                                />
                                <div className="">{feed?.author.name.split(" ")[0].trim()}</div>
                                <div className="">{feed.formattedCreatedAt}</div>
                            </div>
                            { editMode && currentlyEditedPostId == feed.id ? (
                                <div className="flex w-full py-2 rounded-xl flex-col bg-white text-gray-900">
                                    <textarea row={1} className=' rounded-lg resize-none' value={editText[feed.id] || ""} onChange={(e) => setEditText({ ...editText, [feed.id]: e.target.value })} />
                                    <div className='flex justify-between ml-5 items-center'>
                                        <div className="flex justify-between items-center w-full -mb-5">
                                            <Voters postId={feed.id} />
                                            <button onClick={() => editPost(feed?.id)} className="h-10 p-2 text-sm text-white bg-blue-800 rounded-md cursor-pointer">Update</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col justify-between ml-5 items-center'>
                                    <div className="mt-2 w-full">{feed?.body}</div>
                                    <div className="flex justify-between w-full -mb-5">
                                        <Voters postId={feed.id} />
                                        <div className="flex items-center gap-2">
                                            { session?.account?.id == feed?.author?.id ? (<button onClick={() => deletePost(feed?.id)} className="text-red-700 bg-slate-400/50 text-sm cursor-pointer rounded-lg p-2 flex items-center">
                                                <Image
                                                    src="/images/delete.png"
                                                    height={140}
                                                    width={140}
                                                    className="w-4 h-4"
                                                    alt="delete icon"
                                                />
                                                <span>Delete</span>
                                            </button>) :(
                                                <div></div>
                                            )}
                                            <div className=''>
                                                { session?.account?.id !== feed?.author?.id ? (<button onClick={()=>replyToggle(feed?.id)} className="flex gap-2 cursor-pointer">
                                                    <img
                                                        src="/svg/reply.svg"
                                                        className='w-5 h-5'
                                                        alt="reply icon"
                                                    />
                                                    <div className='font-bold text-green-500'>Reply</div>
                                                </button>):(<div className=''></div>)}
                                            { session?.account?.id == feed.author.id ? ( <button onClick={() => editToggle(feed?.id)} className='flex items-center cursor-pointer'>
                                                    <Image
                                                        src="/images/edit.png"
                                                        alt="edit icon"
                                                        height={140}
                                                        width={140}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className='font-bold text-blue-800'>Edit</span>
                                                </button>):(
                                                    <div></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className=' px-4 py-2 rounded-xl flex-col bg-white '>
                                {comments.map((comment) =>{
                                    return (
                                        <>

                                            {feed.id == comment.postId ? (<div key={comment.id} className=''>{comment.comment}</div>):(
                                                <div key={comment.id}></div>
                                            )}
                                        </>
                                    )
                                })}
                            </div>
                            { replyMode & currentlyReplyingCommentId == feed.id ? ( <div>
                                <div className=' flex gap-2 items-center'>
                                    <img 
                                        src={session?.user?.image}
                                        className='w-8 h-8 rounded-full'
                                        alt="profile image"
                                    />
                                    <form onSubmit={(e)=>createComment(e, feed.id)} className="flex w-full  gap-5">
                                        <fieldset className="flex w-full items-center gap-2">
                                            <textarea  className=" h-14 w-full rounded-lg" onChange={(e)=>setComment(e.target.value)} value={comment} placeholder='Add a comment'></textarea>
                                            <button type="submit" className=" p-2 rounded-xl text-white bg-blue-950/80 w-14">Reply</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>):(<div></div>)}
                        </div>
                    )
                            
                })}
            </div>
            <div className=" w-full shadow-md px-4 py-2 rounded-xl  flex-col bg-white ">
                <form onSubmit={createPost} className="flex w-full justify-start gap-5">
                    <fieldset className="flex w-full flex-col">

                        <textarea  className=" h-24 w-full rounded-lg" onChange={(e)=>setText(e.target.value)} value={text} placeholder='Add a comment'></textarea>
                        <div className='flex justify-between mt-5'>

                            <img
                            src={session?.user?.image}
                            className=" w-12 h-12 rounded-full"
                            />
                            <button type="submit" className=" p-2 rounded-xl text-white bg-blue-950/80 w-24">Send</button>
                        </div>
                    </fieldset>
                </form>
            </div>
            <Testing/>
        </div>
    )
}

export default Feeds