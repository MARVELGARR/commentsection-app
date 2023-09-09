"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import VotingLoading from './loadingAnimation/votingAnimation';

function CommentVote( { commentId } ) {
        
    const [counts, setCounts] = useState({});
    const [isVoting, setIsVoting] = useState(false);

    const commentVote = async (e, commentId, state, value) => {
        e.preventDefault();
        if (value === 1) {
          state = true;
        }
        else if (value === -1){
          state = false;
        }
    
        try {
            const vote = await fetch(`/api/comment/${commentId}`, {
                method: 'PATCH',
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ state })
            });
      
            if (vote.ok) {
                await getScore(commentId);
                toast.success("Voted successfully");
            } else {
                toast.error("Failed to vote. Please try again later.");
            }
        } catch (error) {
            console.error(error); // Log the specific error for debugging
            toast.error("An error occurred. Please check your connection and try again.");
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
            <div  className="text-sm font-bold text-slate-400/60" onMouseDown={(e) => commentVote(e, commentId, 1, 1)}>+</div>
            <div className="text-sm rotate-90 font-extrabold">{counts[commentId]}</div>
            <div className="text-sm font-bold rotate-90 text-slate-400/60" onMouseDown={(e) => commentVote(e, commentId, -1, -1)}>-</div>
        </div>
        <div className='pl-1'>{ isVoting ? (<VotingLoading/>) : (<div></div>)}</div>
    </div>
  )
}

export default CommentVote
