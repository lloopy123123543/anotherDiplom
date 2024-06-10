import {Modal} from "@/app/components/Modal/Modal";
import {Button, Input, Typography} from "@material-tailwind/react";
import React, {useState} from "react";
import {ID} from "appwrite";
import {databases} from "@/app/appwrite";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {toast} from "react-toastify";

export const ModalCreateCategory = ({user,isOpen,setIsOpen}) => {
  const [categoryName, setCategoryName] = useState("")



  const createCategory = () => {
   try{
     if(categoryName){
       try {
         databases.createDocument(
           '664dccf6002506fb7cb7',
           '664dcd4e002e1707355a',
           ID.unique(),
           {
             "users": user.$id,
             "spending_title": `${categoryName}`
           }
         );
         toast.success("Создано")
       }
       catch (e){
         toast.error("Что то пошло не так")
       }
     }else{
       toast.error("Необходимо ввести данные")
     }

   }
  catch (e){
     console.log(e)
  }
  }

  return(
        <Modal>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div onClick={() => setIsOpen((!isOpen))} className="flex justify-end cursor-pointer">
                <CloseIcon/>
              </div>
              <Typography className="font-normal text-blue-gray-600">
                Название категории
              </Typography>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                size="sm"
              />
            </div>

            <Button onClick={() => createCategory()}>Создать</Button>
          </div>
        </Modal>

  )
}