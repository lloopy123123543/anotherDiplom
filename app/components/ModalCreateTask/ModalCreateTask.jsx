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

export const ModalCreateTask = ({categories, user, setIsOpen, isOpen, allSpendings, setAllSpendings}) => {
  const [taskName, setTaskName] = useState()
  const [currentOption, setCurrentOption] = useState()
  const [cost, setCost] = useState(0)
  const [date, setDate] = useState()
  const [spend, setSpend] = useState(false)
  console.log(allSpendings)

  const createTask = async () => {

    await databases.createDocument(
    '664dccf6002506fb7cb7',
    '664dce0100154939f73c',
    ID.unique(),
    {
      "spendings": `${currentOption.id}`,
      "spendTitle": `${taskName}`,
      "cost": Number(cost),
      "datetime": date.toISOString(),
      "spend": spend
    }
    );
    toast.success("Создано")
    setAllSpendings([
      {
        spendings: `${currentOption.title}`,
        cost: Number(cost),
        spendTitle: `${taskName}`,
        datetime: date.toISOString(),
        spend: spend
      },
      ...allSpendings

    ]);
  }

  return(
    <Modal>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div onClick={()=> setIsOpen((!isOpen))} className="flex justify-end cursor-pointer">
            <CloseIcon/>
          </div>
          <Typography  className="font-normal text-blue-gray-600">
            Создание расхода/дохода
          </Typography>
          <Select onChange={(val) => setCurrentOption(val)} >
            {categories.map((cat) => (
              <Option key={cat.$id} value={{
                id: cat.$id,
                title: cat.spending_title
              }}>
                {cat.spending_title}
              </Option>
            ))}
          </Select>

          <Select onChange={(val) => setSpend(val)} >(
              <Option value={true}>
                Трата
              </Option>
            <Option value={false}>
              Заработок
            </Option>
          </Select>

          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            type="text"
            className="w-full"
            variant="outlined"
            color="blue-gray"
            placeholder={"Пояснение"}
            size="sm"
          />
          <Input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            type="number"
            className="w-full"
            variant="outlined"
            color="blue-gray"
            size="sm"
          />
          <Popover placement="bottom">
            <PopoverHandler>
              <Input
                label="Select a Date"
                onChange={() => null}
                value={date ? format(date, 'yyyy-MM-dd\'T\'HH.mm:sssxxxxx') : ''}
              />
            </PopoverHandler>
            <PopoverContent>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                showOutsideDays
                className="border-0"
                classNames={{
                  caption: "flex justify-center py-2 mb-4 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "flex items-center",
                  nav_button:
                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                  nav_button_previous: "absolute left-1.5",
                  nav_button_next: "absolute right-1.5",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_range_end: "day-range-end",
                  day_selected:
                    "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={() => createTask()}>Создать</Button>
      </div>
    </Modal>
  )
}