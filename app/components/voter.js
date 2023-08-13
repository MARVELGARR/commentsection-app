import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/features/counter/counterSlice';
import { useSession } from 'next-auth/react';
import { getAllPost } from './getAllPost';
import { toast } from 'react-hot-toast';

function Voters({ postId, initialCount }) {
  const dispatch = useDispatch();
  const session = useSession();
  const [counts, setCounts] = useState({});

  const voting = async (e, postId, value) => {
    e.preventDefault();

    if (!session) {
      return console.log("user not signed in");
    }

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


    <div className=" -rotate-90 rounded-md shadow-sm p-2">
      <div onClick={() => dispatch(increment())} className="font-bold text-slate-400/50" onMouseDown={(e) => voting(e, postId, 1)}>+</div>
      <div className="rotate-90">{counts[postId]}</div>
      <div onClick={() => dispatch(decrement())} className="font-bold rotate-90 text-slate-400/50" onMouseDown={(e) => voting(e, postId, -1)}>-</div>
    </div>

  );
}

export default Voters;
