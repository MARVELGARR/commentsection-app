
import  { getServerSession }  from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';
import Feeds from './components/feed';


export default async function Home() {

  const session = await getServerSession(authOptions);

  if(!session?.user){
    redirect("/login?callbackUrl=/")
  }

  await wait(2000)


  return (
    <main className="flex w-screen flex-col min-h-scree bg-slate-400/10 px-3 ">
      <div className=" w-full  flex flex-col mt-5">
        <Feeds/>
      </div>
    </main>
  )
}



export function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}




