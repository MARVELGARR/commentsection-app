"use client"
import React from 'react'
import { useSession } from 'next-auth/react'

function User() {

    const { data: session } = useSession()

  return (
    <div className=''>
      {JSON.stringify(session)}
    </div>
  )
}

export default User