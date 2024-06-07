import React, {useEffect, useState} from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem, Spinner,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  UserPlusIcon,
  UsersIcon
} from "@heroicons/react/24/solid";
import StatisticsCard from "@/app/widgets/cards/statistics-card";
import StatisticsChart from "@/app/widgets/charts/statistics-chart";
import statisticsChartsData from "@/app/data/statistics-charts-data";
import projectsTableData from "@/app/data/projects-table-data";
import {databases} from "@/app/appwrite";
import {Query} from "appwrite";
import {convertDateFormat} from "@/app/configs/formatData";
import {ModalCreateCategory} from "@/app/components/ModalCreateCategory/ModalCreateCategory";
import {ModalCreateTask} from "@/app/components/ModalCreateTask/ModalCreateTask";
import {PlusIcon, TrashIcon} from "@heroicons/react/16/solid";
import {GetStatisticCharts} from "@/app/components/GetStatisticCharts/GetStatisticCharts";

export function Home({user}) {
  const [spendings, setSpendings] = useState(null)
  const [spending, setSpending] = useState(null)
  const [allSpendings, setAllSpendings] = useState([])

  const [modalCreateCategory, setModalCreateCategory] = useState(false)
  const [modalCreateTaskS, setModalCreateTaskS] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const [spendObj, setSpendObj] = useState([])

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
        icon: UsersIcon,
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
                  ({ spendTitle, cost, spendings, spend, datetime }, key) => {
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
                            <TrashIcon className="w-4 cursor-pointer"/>
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

        <Card className="relative bg-clip-border rounded-xl overflow-hidden text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
          <Typography variant="h6" color="blue-gray" className="mb-1">
            Рекомендации от ИИ
          </Typography>
        </Card>
      </div>

    </div>
  );
}

export default Home;
