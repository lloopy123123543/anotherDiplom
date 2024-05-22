import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Бюджет",
    value: "30 000 руб",
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
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Общее кол-во расходов",
    },
  },
  {
    color: "blue",
    icon: UserPlusIcon,
    title: "Виды доходов",
    value: "3",
    footer: {
      color: "text-red-500",
      value: "",
      label: "Все виды доходов",
    },
  },
  {
    color: "green",
    icon: ChartBarIcon,
    title: "Доход",
    value: "20 000 руб",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Средняя сумма дохода",
    },
  },
];

export default statisticsCardsData;
