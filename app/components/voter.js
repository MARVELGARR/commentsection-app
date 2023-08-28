import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/features/counter/counterSlice';
import { useSession } from 'next-auth/react';
import { getAllPost } from './getAllPost';
import { toast } from 'react-hot-toast';
import VotingLoading from './loadingAnimation/votingAnimation';


function Voters({ postId, initialCount }) {
  const dispatch = useDispatch();
  const session = useSession();
  const [counts, setCounts] = useState({});
  const [isVoting, setIsVoting] = useState(false);

  const voting = async (e, postId, value) => {
    e.preventDefault();

    if (!session) {
      return console.log("user not signed in");
    }
    setIsVoting(true);
    try {
      const post = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ count: counts[postId] + value }), // Use the corresponding post's count value from local state
      });

      if (post.ok) {
        const updatedCount = await post.json(); // Get the updated count from the server response
        setCounts({ ...counts, [postId]: updatedCount.score }); // Update the local state with the updated count for the specific post
        toast.success("voted ")
        setIsVoting(false);
        console.log("Voted successfully. Updated count:", updatedCount);
      } else {
        toast.error("Voting failed")
        console.error('Failed to vote', post.status, post.statusText);
      }
    } catch (error) {
      toast.error("somewhere went wrong")
      console.error('Error voting', error);
    }
  };

  const getScore = async (postId) => {
    await wait(2000)
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
        setCounts({ ...counts, [postId]: score }); // Store the score in local state for the specific post
        console.log("Score has been retrieved");
      } else {
        console.log("Post not found");
      }
    } catch (error) {
      console.error("Error getting post", error);
    }
  }


  useEffect(() => {
    getScore(postId);
    
  }, []);

  return (


    <div className=" -rotate-90 rounded-md shadow-sm p-2 bg-slate-400/50">
      <div onClick={() => dispatch(increment())} className="font-bold text-sm text-slate-400/50" onMouseDown={(e) => voting(e, postId, 1)}>+</div>
        { !isVoting ? (<div className="rotate-90 text-cyan-950 text-sm font-extrabold">{counts[postId]}</div>):(<VotingLoading/>)}
      <div onClick={() => dispatch(decrement())} className="font-bold text-sm rotate-90 text-slate-400/60" onMouseDown={(e) => voting(e, postId, -1)}>-</div>
    </div>

  );
}

export default Voters;

export function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}