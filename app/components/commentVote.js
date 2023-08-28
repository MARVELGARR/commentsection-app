"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import VotingLoading from './loadingAnimation/votingAnimation';

function CommentVote( { commentId } ) {
        
    const [counts, setCounts] = useState({});
    const [isVoting, setIsVoting] = useState(false);


    const commentVote = async (e, commentId, value) =>{
        e.preventDefault()
        setIsVoting(true);

        try{
            const comment = await fetch(`api/comment/${commentId}`,{
                method: "PATCH",
                headers:{
                    "content-type": "application/json",
                },
                body: JSON.stringify({ count: counts[commentId] + value })
            })
            if (comment.ok) {
                const updatedCount = await comment.json(); // Get the updated count from the server response
                setCounts({ ...counts, [commentId]: updatedCount.score }); // Update the local state with the updated count for the specific post
                setIsVoting(false)
                toast.success("voted ")
                console.log("Voted successfully. Updated count:", updatedCount);
            } else {
                toast.error("Voting failed")
                console.error('Failed to vote', comment.status, comment.statusText);
            }
        }
        catch (error) {
            toast.error("somewhere went wrong")
            console.error('Error voting', error);
        }
    }

    const getScore = async (commentId) => {
        try {
            const comment = await fetch(`/api/comment/${commentId}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            });
        
            if (comment.ok) {
                const res = await comment.json();
                const score = res.find((item) => item.id === commentId)?.score || 0;
                setCounts({ ...counts, [commentId]: score }); // Store the score in local state for the specific post
                console.log(res);
            } else {
                console.log("Post not found");
            }
        } catch (error) {
            console.error("Error getting post", error);
        }
    }

    useEffect(()=>{
        getScore(commentId)
    },[])
    

  return (
    <div className='flex items-center gap-2'>
        <div className="text-sm -rotate-90 rounded-md shadow-sm p-2 bg-slate-400/50">
            <div  className="text-sm font-bold text-slate-400/60" onMouseDown={(e) => commentVote(e, commentId, 1)}>+</div>
            <div className="text-sm rotate-90 font-extrabold">{counts[commentId]}</div>
            <div className="text-sm font-bold rotate-90 text-slate-400/60" onMouseDown={(e) => commentVote(e, commentId, -1)}>-</div>
        </div>
        <div className='pl-1'>{ isVoting ? (<VotingLoading/>) : (<div></div>)}</div>
    </div>
  )
}

export default CommentVote
