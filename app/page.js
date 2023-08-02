
import  { getServerSession }  from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';
import Post from './components/post';
import Feeds from './components/feed';



export const metadata = {
  title: 'Home',
  description: 'Generated by create next app',
}


export default async function Home() {

  const session = await getServerSession(authOptions);

  if(!session?.user){
    redirect("/login?callbackUrl=/")
  }

  


  return (
    <main className="flex flex-col min-h-screen p-5">
      <div className="">
        <Feeds/>
      </div>
      <div>
        <Post/>
      </div>
    </main>
  )
}








