"use client"

import {account, ID} from "@/app/appwrite";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkProfile(){
      if(await account.get()){
        router.push("/dashboard")
        return
      }else{
        router.push("/sign-in")
        return
      }
    }
    checkProfile()
  }, []);

  return (
  <div>
    sus
  </div>
  );
}
