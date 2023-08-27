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
import CommentVote from './commentVote';




function Feeds() {

    const [feeds, setFeeds] = useState([])
    const [comments, setComments] = useState([])
    const [ editText, setEditText] = useState({})
    const [editMode, setEditMode] = useState({})
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
    const [replyMode, setReplyMode] = useState({ })
    const [currentlyReplyingCommentId, setCurrentlyReplyingCommentId] = useState(null)
    const [commentReplyMode, setCommentReplyMode] = useState({ })
    const [currentlyCommentReplyingCommentId, setCurrentlyCommentReplyingCommentId] = useState(null)
    const [commentReply, setCommentReply] = useState("")
    const [editComment, setEditComment] = useState({})
    const [commentEditMode, setCommentEditMode] = useState({})
    const [currentlyEditedCommentId, setCurrentlyEditedCommentId] = useState(null)

    const [isDeleteOpen, setIsDeleteOpen] = useState({})
    const [currentlyDeletingPostId, setCurrentlyDeletingPostId] = useState(null)
    const [isCommentDeleteOpen, setIsCommentDeleteOpen] = useState({})
    const [currentlyDeletingCommentId, setCurrentlyDeletingCommentId] = useState(null)

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


    const toggleDeletePost = (postId) => {
        if(currentlyDeletingPostId == postId) {
            setCurrentlyDeletingPostId(postId);
            setIsDeleteOpen({ isOpen: false, id: postId})
        }
        else{
            setCurrentlyDeletingPostId(postId);
            setIsDeleteOpen({ isOpen: true, id: postId});
        }
    }
    const cancelDialog = (postId) => {
        setCurrentlyDeletingPostId(null);
        setIsDeleteOpen({ isOpen: false, id: postId});
        console.log(isDeleteOpen)
    }
    const toggleDeleteComment = (commentId) => {
        if(currentlyDeletingPostId == commentId) {
            setCurrentlyDeletingCommentId(commentId);
            setIsCommentDeleteOpen({ isOpen: false, id: commentId})
        }
        else{
            setCurrentlyDeletingCommentId(commentId);
            setIsCommentDeleteOpen({ isOpen: true, id: commentId});
        }
    }
    const cancelCommentDialog = (commentId) => {
        setCurrentlyDeletingCommentId(null);
        setIsCommentDeleteOpen({ isOpen: false, id: commentId});
        console.log(isDeleteOpen)
    }

    //toggle between editmmode
    const editToggle = (postId) => {
        if (currentlyEditedPostId == postId) {
            setCurrentlyEditedPostId(postId); // Turn off edit mode for this post
            setEditMode({mode: false, id: postId});
        } else {
            getPostBody(postId);
            setCurrentlyEditedPostId(postId); // Set the currently edited post ID
            setEditMode({mode: true, id: postId}); // Enable edit mode
        }
    };

    const editCommentToggle = (commentId) => {
        if (currentlyEditedCommentId == commentId) {
            setCurrentlyEditedCommentId(commentId); // Turn off edit mode for this post
            setCommentEditMode({mode: false, id: commentId});
        } else {
            getCommentBody(commentId);
            setCurrentlyEditedCommentId(commentId); // Set the currently edited post ID
            setCommentEditMode({mode: true, id: commentId}); // Enable edit mode
        }
    };
    
    
    const handleReplyToggle = (id) =>{
        if(currentlyReplyingCommentId === id) {
            setCurrentlyReplyingCommentId(id); //
            setReplyMode(false);
            setReplyMode({...replyMode, mode : replyMode, id: id });
            console.log(replyMode);
        }
        else{
            setReplyMode((prev)=>!prev);
            setCurrentlyReplyingCommentId(id);
            setReplyMode({...replyMode, mode : replyMode, id: id });
            console.log(replyMode);
        }
    }

    const handleCommentReplyToggle = (id) =>{
        if(currentlyCommentReplyingCommentId === id) {
            setCurrentlyCommentReplyingCommentId(id); //
            setCommentReplyMode(false);
            setCommentReplyMode({...commentReplyMode, mode : commentReplyMode, id: id });
            console.log(commentReplyMode);
        }
        else{
            setReplyMode((prev)=>!prev);
            setCurrentlyCommentReplyingCommentId(id);
            setCommentReplyMode({...commentReplyMode, mode : commentReplyMode, id: id });
            console.log(commentReplyMode);
        }
    }
    const getPostBody = (postId) =>{       
        const BODY = feeds.find((item)=> item.id == postId)?.body || "";
        setEditText({...editText, [postId]: BODY});
        
    }
    const getCommentBody = (commentId) =>{
        const BODY = comments.find((item)=> item.id == commentId)?.comment || " ";
        setEditComment({...editComment, [commentId]: BODY});
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
            console.log(postId)
      
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

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`/api/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            console.log(commentId)
      
            if (response.ok) {
                fetchComment(); // if the deleting of the post was successful re call all the posts
                toast.success("post deleted successfully");
                const data = await response.json(); // Parse the response body as JSON
                console.log('Comment was deleted successfully', data); //console log the result
            } else {
                const errorData = await response.json();
                toast.error(" comment failed to delete") // Parse the error response as JSON
                console.error('Failed to delete comment', errorData);
            }
        } catch (error) {
            toast.error("something went wrong")
          console.error('Error deleting comment', error);
        }
    };


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

    const handleEditComment = async (commentId)=>{
    
        try{
            const comment = await fetch(`/api/comment/${commentId}`, {
                method: 'PATCH',
                headers:{
                    "content-type": "application/json",
                },
                body: JSON.stringify({ comment: editComment[commentId] }), // Use the correct body property here  
            })
            if(comment.ok){
                fetchComment();
                toast.success("comment updated successfully")
                setCommentEditMode((prev)=> !prev)
                const res = await comment.json();
                console.log("post updated", res);
            }
            else{
                toast.error("Error updating post")
                console.error("Error updating comment", comment.statusText);
            }
        }
        catch(error){
            toast.error("something went wrong")
            console.error("Error updating comment", error);
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
                fetchComment();
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

    const createReply = async (e, commentId) =>{
        e.preventDefault();
        try{
            const reply = await fetch(`/api/comment/${commentId}`,{
                method: 'POST',
                headers:{
                    "content-type": "application/json",
                },
                body: JSON.stringify({ commentReply })
            })
            if(reply.ok){
                toast.success("Replied successfull")
                setCommentReplyMode({})
                fetchComment();
                console.log("replied successfully", reply)
            }
            else{
                toast.error("Failed to reply")
                console.error("Replied error", reply.statusText)
            }
        }
        catch(error){
            toast.error("Something went wrong")
            console.error("something went wrong",error)
        }
    }



    




    return (
        <>
        <div className={` flex flex-col gap-2 relative`}>
            <div className="flex flex-col mt-2">

                {feeds.map((feed) => {
                    return (
                        <>
                        {isDeleteOpen.isOpen && currentlyDeletingPostId == feed.id ? (
                                    <div className="fixed inset-0 flex items-center justify-center z-10">
                                        <div className="bg-white p-6 rounded shadow-md">
                                            <p className="mb-4">Are you sure you want to delete this item?</p>
                                            <button onClick={() => deletePost(feed.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">
                                            Delete
                                            </button>
                                            <button onClick={()=>cancelDialog(feed.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
                                            Cancel
                                            </button>
                                        </div>
                                    </div>
                                ):(<div></div>)}
                                <div className={` ${ !isDeleteOpen.isOpen ? "" : " absolute bg-black/30 inset-0  opacity-50 "}`}></div>
                        <div postId={feed.id} key={feed.id} className=" flex flex-col gap-2">
                            <div className="flex w-full gap-2 shadow-md px-4 py-2 rounded-xl flex-col bg-white text-gray-900">

                                <div className='flex gap-5'>
                                    <img
                                        src={feed?.author?.image}
                                        className='w-7 h-7 rounded-full'
                                        alt="Author Avatar"
                                    />
                                    <div className="">{feed?.author.name.split(" ")[0].trim()}</div>
                                    <div className="">{feed.formattedCreatedAt}</div>
                                </div>
                                { editMode.mode && editMode.id == feed.id ? (
                                    <div className="flex w-full py-2 rounded-xl flex-col bg-white text-gray-900">
                                        <textarea row={1} className=' rounded-lg resize-none' value={editText[feed.id] || ""} onChange={(e) => setEditText({ ...editText, [feed.id]: e.target.value })} />
                                        <div className='flex justify-between ml-5 items-center'>
                                            <div className="flex justify-between items-center w-full -mb-5">
                                                <Voters postId={feed.id} />
                                                <button onClick={()=>editPost(feed?.id)} className="h-10 p-2 text-sm text-white bg-blue-800 rounded-md cursor-pointer">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex flex-col justify-between ml-5 items-center'>
                                        <div className="mt-2 w-full">{feed?.body}</div>
                                        <div className="flex justify-between h-18 w-full -mb-5">
                                            <Voters postId={feed.id} />
                                            <div className="flex items-center gap-2">
                                                { session?.account?.id == feed?.author?.id ? (<button onClick={()=>toggleDeletePost(feed?.id)}  className="text-red-700 bg-slate-400/50 text-sm cursor-pointer rounded-lg p-2 flex items-center">
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
                                                    { session?.account?.id !== feed?.author?.id ? (<button onClick={() => handleReplyToggle(feed?.id)} className="flex gap-2 cursor-pointer">
                                                        <img
                                                            src="/svg/reply.svg"
                                                            className='w-3 h-3'
                                                            alt="reply icon"
                                                        />
                                                        <div className='font-bold text-green-500  text-sm'>Reply</div>
                                                    </button>):(<div className=''></div>)}
                                                { session?.account?.id == feed.author.id ? ( <button onClick={()=>editToggle(feed.id)} className='flex items-center cursor-pointer'>
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
                                
                            </div>
                            { replyMode.mode && replyMode.id == feed.id ? ( <div>
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
                            { feed.comments.length > 0 ? (<div className='flex flex-col  bg-slate-400/50 rounded-md p-1'>
                                
                                
                                {comments.map((comment) =>{
                                    return (
                                        <>
                                            {isCommentDeleteOpen.isOpen && currentlyDeletingCommentId == comment.id ? (
                                                <div className="fixed inset-0 flex items-center justify-center z-10">
                                                    <div className="bg-white p-6 rounded shadow-md">
                                                        <p className="mb-4">Are you sure you want to delete this item?</p>
                                                        <button onClick={()=> deleteComment(comment?.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">
                                                        Delete
                                                        </button>
                                                        <button onClick={()=>cancelCommentDialog(comment?.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
                                                        Cancel
                                                        </button>
                                                    
                                                    </div>
                                                </div>
                                            ):(<div></div>)}
                                                <div className={` ${ !isCommentDeleteOpen.isOpen ? " " : " absolute bg-black/10 inset-0  opacity-50 "} `}></div>
                                                <div className='flex mb-2 ml-5  px-4 rounded-xl shadow-md bg-white flex-col'>
                                                    {feed.id == comment.postId ? (<div className="flex  flex-col gap-3">
                                                        <div className='flex gap-3'>
                                                            <img 
                                                                src={comment?.user?.image}
                                                                className="w-7 h-7 rounded-full"
                                                            />
                                                            <div className=''>{comment?.formattedCreatedAt}</div>
                                                        </div>
                                                        { commentEditMode.mode && commentEditMode.id == comment.id ? (
                                                            <div className="flex w-full py-2 rounded-xl flex-col bg-white text-gray-900">
                                                                <textarea row={1} className=' h-10 rounded-lg resize-none' value={ editComment[comment.id] || ""} onChange={(e) => setEditComment({ ...editComment, [comment.id]: e.target.value })} />
                                                                <div className='flex justify-between ml-5 items-center'>
                                                                    <div className="flex justify-end items-center w-full mt-3">
                                                                        <button onClick={()=>handleEditComment(comment?.id)} className="h-10 p-2 text-sm text-white bg-blue-800 rounded-md cursor-pointer">Update</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (                                                        
                                                            <div>

                                                                <div  className=''><span className=" text-purple-900 font-bold">@{comment?.post?.author?.name.split(" ")[0].trim()}</span> <span className=' break-all'>{comment.comment}</span></div>
                                                                    <div className="flex justify-between items-center  h-10 ml-5">
                                                                    <CommentVote commentId={comment.id} />
                                                                    <div className='flex gap-2 items-center'>

                                                                        { session?.account?.id !== comment?.author?.id ? (<button onClick={()=>editCommentToggle(comment.id)} className='flex items-center cursor-pointer'>
                                                                            <Image
                                                                                src="/images/edit.png"
                                                                                alt="edit icon"
                                                                                height={140}
                                                                                width={140}
                                                                                className="w-4 h-4"
                                                                            />
                                                                            <span className='font-bold text-blue-800'>Edit</span>
                                                                        </button>):(<div className=''></div>)}
                                                                        { session?.account?.id !== comment?.author?.id ? (<button onClick={()=>toggleDeleteComment(comment?.id)}  className="text-red-700 bg-slate-400/50 text-sm cursor-pointer rounded-lg p-2 flex items-center">
                                                                            <Image
                                                                                src="/images/delete.png"
                                                                                height={140}
                                                                                width={140}
                                                                                className="w-3 h-3"
                                                                                alt="delete icon"
                                                                            />
                                                                            <span>Delete</span>
                                                                        </button>) :(
                                                                            <div></div>
                                                                        )}
                                                                        { session?.account?.id !== comment?.author?.id ? (<button onClick={() => handleCommentReplyToggle(comment?.id)} className="flex gap-2 cursor-pointer">
                                                                            <img
                                                                                src="/svg/reply.svg"
                                                                                className='w-3 h-3'
                                                                                alt="reply icon"
                                                                            />
                                                                            <div className='font-bold text-green-500 text-sm'>Reply</div>
                                                                        </button>):(<div className=''></div>)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        

                                                    </div>):(<div></div>)}
                                                </div>
                                                { commentReplyMode.mode && commentReplyMode.id == comment.id ? ( <div>
                                                    <div className=' mt-3 flex gap-2 items-center'>
                                                        <img 
                                                            src={session?.user?.image}
                                                            className='w-8 h-8 rounded-full'
                                                            alt="profile image"
                                                        />
                                                        <form onSubmit={(e)=>createReply(e, comment.id)} className="flex w-full  gap-5">
                                                            <fieldset className="flex w-full items-center gap-2">
                                                                <textarea  className=" h-14 w-full rounded-lg" onChange={(e)=>setCommentReply(e.target.value)} value={commentReply} placeholder='Add a comment'></textarea>
                                                                <button type="submit" className=" p-2 rounded-xl text-white bg-blue-950/80 w-14">Reply</button>
                                                            </fieldset>
                                                        </form>
                                                    </div>
                                                </div>):(<div></div>)}
                                        </>

                                    )

                                
                                })}
                                
                                
                            </div>):(<div></div>)}
                        </div>
                        </>
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
                                height={140}
                                width={140}
                            />
                            <button type="submit" className=" p-2 rounded-xl text-white bg-blue-950/80 w-24">Send</button>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
        </>
    )
                        
}

export default Feeds