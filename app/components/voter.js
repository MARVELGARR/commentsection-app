import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/features/counter/counterSlice';
import { useSession } from 'next-auth/react';
import { getAllPost } from './getAllPost';
import { toast } from 'react-hot-toast';
import VotingLoading from './loadingAnimation/votingAnimation';



function Voters({ postId, initialCount }) {
  const [counts, setCounts] = useState({});
  const [isVoting, setIsVoting] = useState(false)

  const votingState = async (e, postId, state, value) => {
    e.preventDefault();
    setIsVoting(true);
    if (value === 1) {
      state = true;
    }
    else if (value === -1){
      state = false;
    }

    try {
      const vote = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ state })
      });
  
      if (vote.ok) {
        const res = await vote.json();
        console.log(res);
        await getScore(postId);
        setIsVoting(false);
        toast.success("Voted successfully");
      } else {
        toast.error("Failed to vote. Please try again later.");
      }
    } catch (error) {
      console.error(error); // Log the specific error for debugging
      toast.error("An error occurred. Please check your connection and try again.");
    }
  }
  



  const getScore = async (postId) => {
    await wait(2000);
    try {
      const post = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
  
      if (post.ok) {
        const res = await post.json();
        const score = res.find((item) => item.id === postId)?.score || 0;
  
        // Use functional update to ensure the correct state update
        setCounts((prevCounts) => ({ ...prevCounts, [postId]: score }));
      } else {
        console.log("Post not found");
      }
    } catch (error) {
      console.error("Error getting post", error);
    }
  };


  useEffect(() => {
    getScore(postId);
    
  }, []);

  return (

    <div className="flex gap-2 items-center">

      <div className=" -rotate-90  flex-col items-center rounded-md shadow-sm p-2 bg-slate-400/50">
        <div onClick={(e) => votingState(e, postId, 1, 1)} className="font-bold cursor-pointer lg:rotate-90 text-sm text-slate-400/50" >+</div>
          <div className=" lg:rotate-0 rotate-90 text-cyan-950 text-sm font-extrabold">{counts[postId]}</div>
        <div onClick={(e) => votingState(e, postId, -1, -1)} className="font-bold cursor-pointer lg:rotate-180 lg:mr-[0.35rem] text-sm rotate-90 text-slate-400/60">-</div>
      </div>
      <div className="pl-1">{ isVoting ? (<VotingLoading/>):(<div></div>)}</div>  
    </div>

  );
}

export default Voters;

export function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}