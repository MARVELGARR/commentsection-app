"use client"
import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


export const metadata = {
    title: 'Login',
    description: 'login section',
}


function Login() {

    
    const [data, setData] = useState({
        email:"",
        password:"",
    })

    const router = useRouter()
    const {session, status} = useSession({
        redirect: true,
        onAuthenticated() {
            redirect("/")
        }
    })

    useEffect(()=>{
        if(status ==="loading"){
            return
        }
        if(status === "authenticated"){
            router.push("/")
        }
        
    },[status])
    

    const login = async (e) =>{
        e.preventDefault();
        try{

            signIn("credentials", {...data, redirect:false})
            .then((callback)=>{
                if(callback?.error){
                    toast.error(callback.error)
                }
                if(callback?.ok && !callback?.error){

                    toast.success("Logged in")
                }
            })
                       
        }
        catch(error){
            toast.error("someting went wrong") 
        }
    }

  return (

    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={login} className="space-y-6" >
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div className="mt-2">
                        <input value={data.email} onChange={(e)=>setData({...data, email:e.target.value})} id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>

                    </div>
                    <div className="mt-2">
                        <input value={data.password} onChange={(e)=>setData({...data, password:e.target.value})} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                </div>

                <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                </div>
            </form>
            <div className='flex w-full gap-2 mt-3 items-center justify-center'>
                <button onClick={()=>signIn("github")} className="w-full flex bg-white border-black border-4 rounded-xl items-center justify-center">
                    <img 
                        src="/svg/github.svg"
                        alt="github"
                        className="w-10 h-10"
                    />
                    <p className="">github</p>
                </button>
                <button onClick={()=>signIn("google")} className="w-full flex rounded-xl border-black border-4 justify-center items-center">
                    <img 
                        src="/svg/google.svg"
                        alt="goggle"
                        className="w-10 h-10"
                    />
                    <p>google</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Login
