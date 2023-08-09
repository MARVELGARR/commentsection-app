"use client"
import React from 'react'
import { useSession } from 'next-auth/react'

function User() {

  const getUserById = async () => {
    try {
      const userResponse = await fetch(`/api/user/${authorId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        return userData;
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Error getting user data", error);
      return null;
    }
  };

  return (
    <div className=''>
      {JSON.stringify(session)}
    </div>
  )
}

export default User