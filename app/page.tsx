"use client"

import {account, ID} from "@/app/appwrite";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkProfile(){
      if(account && await account.get()){
        toast.success("Вы уже авторизованы")
        router.push("/dashboard")
        return
      }else{
        toast.success("Переход на страницу авторизации")
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
