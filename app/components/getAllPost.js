// api.js
"use client"
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';


export const getAllPost = async () => {
    try {
      const posts = await fetch('/api/posts', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      });
      if (posts.ok) {
        const res = await posts.json();
        console.log(" post gotten ", res)
  
        const formattedPosts = res.map((post) => {
          const createdAtDate = parseISO(post.createdAt);
          const formattedCreatedAt = formatDistanceToNow(createdAtDate, { addSuffix: true });
  
          return { ...post, formattedCreatedAt };
        });
  
        return formattedPosts;
      } else {
        console.log('Posts not found');
        return [];
      }
    } catch (error) {
      console.error('Error getting posts', error);
      return [];
    }
};

