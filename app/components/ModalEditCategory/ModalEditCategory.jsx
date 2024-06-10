import {Modal} from "../Modal/Modal";
import {
  Button,
  Input,
  Option,
  Popover, PopoverContent,
  PopoverHandler,
  Select,
  Typography
} from "@material-tailwind/react";
import React, {useState} from "react";
import {databases} from "@/app/appwrite";
import {ID} from "appwrite";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/16/solid";
import {DayPicker} from "react-day-picker";
import {format} from "date-fns";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {toast} from "react-toastify";

export const ModalEditCategory = ({currentEdit, categories, user, setIsOpen, isOpen}) => {
  const [taskName, setTaskName] = useState()


  const editCategory = async () => {
    try {
      await databases.updateDocument(
        '664dccf6002506fb7cb7',
        '664dcd4e002e1707355a',
        currentEdit,
        {
          spending_title: taskName
        }
      );
      toast.success("Изменено")
    } catch (e) {
      toast.error("Что то пошло не так")
    }

  }

  return(
    <Modal>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div onClick={()=> setIsOpen((!isOpen))} className="flex justify-end cursor-pointer">
            <Typography>Редактировать категорию</Typography>
            <CloseIcon/>
          </div>

          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            type="text"
            className="w-full"
            variant="outlined"
            color="blue-gray"
            placeholder={"Название"}
            size="sm"
          />
        </div>

        <Button onClick={() => editCategory()}>Изменить</Button>
      </div>
    </Modal>
  )
}