"use client"
import React, {useEffect, useMemo, useState} from "react";
import {databases} from "../../appwrite";
import {Query} from "appwrite";
import {ModalCreateCategory} from "../ModalCreateCategory/ModalCreateCategory";
import {ModalCreateTask} from "../ModalCreateTask/ModalCreateTask";
import {
  Card, CardBody,
  CardHeader,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList, Spinner,
  Typography
} from "@material-tailwind/react";
import StatisticsCard from "../../widgets/cards/statistics-card";
import {getAllCategoryes, GetStatisticCharts} from "../GetStatisticCharts/GetStatisticCharts";
import {BanknotesIcon, ChartBarIcon, ClockIcon, UserIcon, UserPlusIcon} from "@heroicons/react/24/solid";
import StatisticsChart from "../../widgets/charts/statistics-chart";
import {PlusIcon, TrashIcon} from "@heroicons/react/16/solid";
import projectsTableData from "../../data/projects-table-data";
import {convertDateFormat} from "../../configs/formatData";


export function Homepages({user}) {
  const [spendings, setSpendings] = useState(null)
  const [allSpendings, setAllSpendings] = useState([])
  const [modalCreateCategory, setModalCreateCategory] = useState(false)
  const [modalCreateTaskS, setModalCreateTaskS] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [spendObj, setSpendObj] = useState([])

  const [AIMessage, setAIMessage] = useState("")
  const [AIReadyMessage, setAIReadyMessage] = useState()

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
  }, [user, modalCreateCategory, setModalCreateCategory, setModalCreateTaskS, modalCreateTaskS]);

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
  }, [spendings, modalCreateCategory, setModalCreateCategory, setModalCreateTaskS, modalCreateTaskS]);

  const deleteTask = async (id) => {
    try {
      const res = await databases.deleteDocument(
        '664dccf6002506fb7cb7',
        '664dce0100154939f73c',
        id
      );
      await setSpendings(res.documents);
    } catch (error) {
      console.error('Error fetching database:', error);
    }

  }

  useEffect(() => {
    const gpt = async () => {
      const url = 'https://chatgpt-42.p.rapidapi.com/geminipro';
      // const url = 'https://hello.ru';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '399ba41038msh4878176e8c6e9afp17a3f4jsn89a13410ae86',
          'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content:
                 `Представь что ты Финансовый аналитик, тебе нужно сделать рекомендации, пиши по русски, без использования языка разметки или markdown, опирайся только на те данные, которые я укажу, не пиши точных чисел и опирайся на рубли а не на доллары, а так-же это личные расходы, не надо писать инчего про бизнес
                          Всего есть такие категории трат и доходов:
                           Категория - ${alcategoryes && alcategoryes.map((spend, index) => {
                              return `${spend.title}, которая вышла в ${spend.value.cost} рублей`
                            })}`
            }
          ],
          temperature: 0.9,
          top_k: 5,
          top_p: 0.9,
          max_tokens: 900,
          web_access: false
        })
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setAIMessage(result.result)
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
    gpt();
  }, [spendObj]);

  // useEffect(() => {
  //
  //   let data = {
  //     'scope': 'GIGACHAT_API_PERS'
  //   }
  //   let config = {
  //     method: 'POST',
  //     maxBodyLength: Infinity,
  //     url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Accept': 'application/json',
  //       'RqUID': '235cb865-5466-485c-b49d-cc57a2844745',
  //       'Access-Control-Allow-Origin': "*",
  //       'Authorization': 'Basic ZWY1ZjdkMmItNjgyYy00N2I0LThmZTAtMmU1YmZkNzhhYTNiOjIzNWNiODY1LTU0NjYtNDg1Yy1iNDlkLWNjNTdhMjg0NDc0NQ=='
  //     },
  //     data: data,
  //     withCredentials: false,
  //     crossDomain: true,
  //   };
  //
  //   axios(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);



  useEffect(() => {
    for (let i = 0; i < AIMessage.length; i++) {
      const mess = AIMessage.substring(0, i + 1);
      setTimeout(() => {
        setAIReadyMessage(mess);
      }, (i + 1) * 80);
    }

  }, [AIMessage]);


  const getStatisticsCardsData = () => {
    const budget = () => {
      let sum = 0;
      if (allSpendings && allSpendings.length > 0) {
        allSpendings.forEach((spend) => {
          if (spend.spend && spend.cost) {
            sum -= spend.cost;
          } else {
            sum += spend.cost;
          }
        });
      }
      return sum;
    };

    const spends = () => {
      let sum = 0;
      if (allSpendings && allSpendings.length > 0) {
        allSpendings.forEach((spend) => {
          if (spend.spend && spend.cost) {
            sum += spend.cost;
          }
        });
      }
      return sum;
    };

    const improve = () => {
      let sum = 0;
      if (allSpendings && allSpendings.length > 0) {
        allSpendings.forEach((spend) => {
          if (!spend.spend && spend.cost) {
            sum += spend.cost;
          }
        });
      }
      return sum;
    };

    return [
      {
        color: "gray",
        icon: BanknotesIcon,
        title: "Бюджет",
        value: `${budget()} руб`,
        footer: {
          color: "text-green-500",
          value: "",
          label: "Кол-во денег в настоящее время",
        },
      },
      {
        color: "red",
        icon: UserIcon,
        title: "Расходы",
        value: `${spends()} руб`,
        footer: {
          color: "text-green-500",
          value: "",
          label: "Общее кол-во расходов",
        },
      },
      {
        color: "blue",
        icon: UserPlusIcon,
        title: "Позиции",
        value: `${allSpendings.length}`,
        footer: {
          color: "text-red-500",
          value: "",
          label: "Все позиции",
        },
      },
      {
        color: "light-green",
        icon: ChartBarIcon,
        title: "Доход",
        value: `${improve()} руб`,
        footer: {
          color: "text-green-500",
          value: "",
          label: "Средняя сумма дохода",
        },
      },
    ];
  }

  const getAllCategoryes = () => {
    const array = [];

    if (spendObj.length > 0) {
      spendObj.forEach((spending) => {
        const obj = {
          title: spending.category.spending_title,
          value: []
        };
        let cost = 0

        spending.spendings.forEach((spend) => {
          if (!spend.spend) {
            cost += spend.cost;
            obj.value.push({
              improve: spend.cost,
              spendTitle: spend.spendTitle
            });
          } else {
            cost -= spend.cost;
            obj.value.push({
              neimprove: spend.cost,
              spendTitle: spend.spendTitle
            });
          }
        });
        obj.value.cost = cost

        array.push(obj);
      });
    }

    return array;
  }

  const alcategoryes = getAllCategoryes()


  return (
    <div className="mt-12">
      {modalCreateCategory && (
        <ModalCreateCategory
          isOpen={modalCreateCategory}
          setIsOpen={setModalCreateCategory}
          user={user}
        />
      )}

      {modalCreateTaskS && (
        <ModalCreateTask
          allSpendings={allSpendings}
          setAllSpendings={setAllSpendings}
          isOpen={modalCreateTaskS}
          setIsOpen={setModalCreateTaskS}
          categories={spendings}
          user={user}/>
      )}

      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 ">
        {getStatisticsCardsData().map(({ icon,
                                         title,
                                         footer,
                                         ...rest
        }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            isLoading={isLoading}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white ",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {GetStatisticCharts(spendObj).statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm ">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Статистика
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <PlusIcon
                    strokeWidth={3}
                    fill="blue-gray"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem> <div onClick={() => setModalCreateCategory(true)}>Создать категорию</div> </MenuItem>
                <MenuItem><div onClick={() => setModalCreateTaskS(true)}>Создать задачу</div></MenuItem>
                {/*<MenuItem>Something else here</MenuItem>*/}
              </MenuList>
            </Menu>
          </CardHeader>
        {isLoading ? (
          <Spinner/>
        ) : (

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                <tr>
                  {["Категория", "Подробнее", "Сумма", "Дата", ""].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
                </thead>
                <tbody>
                {allSpendings.map(
                  ({ spendTitle, cost, spendings, spend, datetime, $id }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {spendings.spending_title || spendings}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {spendTitle}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                            style={{color: spend ? "red" : "green"}}
                          >
                            {cost}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {convertDateFormat(datetime)}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                            <TrashIcon onClick={() => deleteTask($id)} className="w-4 cursor-pointer"/>
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

        <Card className="relative bg-clip-border rounded-xl overflow-hidden text-gray-700 shadow-none m-0 flex items-center p-6">
          <Typography variant="h6" color="blue-gray" className="mb-1">
            Рекомендации от ИИ
          </Typography>
          <div>

            {AIReadyMessage}
          </div>
        </Card>
      </div>

    </div>
  );

}