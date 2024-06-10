import {Avatar, Button, Card, CardBody, Chip, Typography} from "@material-tailwind/react";
import authorsTableData from "../../data/authors-table-data";
import React, {useEffect, useState} from "react";
import {databases} from "../../appwrite";
import {Query} from "appwrite";
import {TrashIcon} from "@heroicons/react/16/solid";
import {ChartBarIcon, PencilIcon} from "@heroicons/react/24/solid";
import {ModalEditCategory} from "../ModalEditCategory/ModalEditCategory";
import {toast} from "react-toastify";

export function Profile({user}) {
  const [spendings, setSpendings] = useState(null)
  const [allSpendings, setAllSpendings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [spendObj, setSpendObj] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentEdit, setCurrentEdit] = useState(null)
  const [isDeleted, setIsDeleted] = useState(0)

  useEffect(() => {
    async function getDatabase() {
      if (user) {
        try {
          const res = await databases.listDocuments(
            '664dccf6002506fb7cb7',
            '664dcd4e002e1707355a',
            [
              Query.equal('users', user["$id"])
            ]
          );
          await setSpendings(res.documents);
        } catch (error) {
          console.error('Error fetching database:', error);
        }
      }
    }
    getDatabase();
  }, [user, isOpen, isDeleted]);

  useEffect(() => {
    async function fetchDataForAllSpendings() {
      if (spendings && spendings.length > 0) {
        const allSpendingsData = [];
        const updatedSpendObj = [];

        for (let i = 0; i < spendings.length; i++) {
          const spendOne = spendings[i];
          const spendingsRes = await databases.listDocuments(
            '664dccf6002506fb7cb7',
            '664dce0100154939f73c',
            [
              Query.equal('spendings', spendOne["$id"])
            ]
          );

          allSpendingsData.push(...spendingsRes.documents);

          updatedSpendObj.push({
            category: spendOne,
            spendings: spendingsRes.documents
          });
        }

        setSpendObj(updatedSpendObj);
        setAllSpendings(allSpendingsData);
        setIsLoading(false);
      }
    }


    fetchDataForAllSpendings();
  }, [spendings]);


  const users = [
    {
      img: user && user.avatar,
      name: user && user.Name,
      email: user && user.email,
      job: ["Пользователь"],
      online: true,
      date: "-",
    },
    {
      img: "https://avatars.githubusercontent.com/u/72884200?v=4",
      name: "Парфёнов Игорь",
      email: "loopsy123123543@gmail.com",
      job: ["Администратор"],
      online: false,
      date: "08/06/24",
    },
  ];

  const deleteCategory = async (id) => {
    try {
      const res = await databases.deleteDocument(
        '664dccf6002506fb7cb7',
        '664dcd4e002e1707355a',
        id
      );
       setIsDeleted((prev) => prev++);
       toast.success("Удалено")

    } catch (error) {
      toast.error("Что-то пошло не так")
      console.error('Error fetching database:', error);
    }

  }
  return (
    <>
      <div className="flex justify-between flex-col">
        <div className="flex justify-between gap-10">
          {console.log(user)}
          {isOpen && (
            <ModalEditCategory currentEdit={currentEdit} isOpen={isOpen} setIsOpen={setIsOpen} user={user}/>
          )}
          <Card className=" p-2">

            {/*<Typography variant="h5" color="blue-gray">Категории</Typography>*/}
            <tbody className="w-full">
            <thead>
            <tr className="w-full">
              {["Категория", "Задач", "Изменить", "Удалить"].map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
            </thead >
                {
                  spendObj.map((spend, index) => (
                      <tr className="pb-6 px-5 border-b border-blue-gray-50 mt-6 w-full flex" key={index + "_sus"}>

                        <td className="w-full flex justify-center items-center">{spend.category.spending_title}</td>
                        <td className="w-full flex justify-center items-center">{spend.spendings.length}</td>
                        <td className="w-full flex justify-center items-center"><PencilIcon onClick={() => {
                          setIsOpen(true)
                          setCurrentEdit(spend.category.$id)
                        }} className="h-4 cursor-pointer"/></td>
                        <td className="w-full flex justify-center items-center "><TrashIcon onClick={() => {
                          deleteCategory(spend.category.$id)
                        }} className="h-4 cursor-pointer"/></td>
                      </tr>
                    )
                  )
                }
            </tbody>
          </Card>

          <Card className="w-screen">
            {user && user.email === "igorparfenovwk@gmail.com" && (
              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                  <tr>
                    {["Друзья", "Роль", "Статус", "Добавлен", ""].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {users.map(
                    ({img, name, email, job, online, date}, key) => {
                      const className = `py-3 px-5 ${
                        key === authorsTableData.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={name}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar src={img} alt={name} size="sm" variant="rounded"/>
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {name}
                                </Typography>
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  {email}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {job[0]}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {job[1]}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={online ? "green" : "blue-gray"}
                              value={online ? "online" : "offline"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {date}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              as="a"
                              href="#"
                              className="text-xs font-semibold text-blue-gray-600 hover:text-red-700"
                            >
                              Удалить
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                  </tbody>
                </table>
              </CardBody>
            )}
          </Card>
        </div>
      </div>


    </>
  );
}

export default Profile;
