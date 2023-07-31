"use client"
import React, { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation';

import { useRouter } from 'next/navigation';



export const metadata = {
  title: 'Dashboard',
  description: 'User Profile',
}

function dashboard() {
    
    const router = useRouter()
    const { data: session, status } = useSession({
      required : true,
      onUnauthenticated()  {
        redirect("/login?callbackUrl=/dashboard")
      }
    })


  return (
    <div>
        <div>Profile</div>
        <img src={session?.user?.image} className=""/>
        <button onClick={()=>signOut()} className="bg-cyan-900 text-white p-2 rounded-xl ">sign out</button>
    </div>
  )
}

export default dashboard