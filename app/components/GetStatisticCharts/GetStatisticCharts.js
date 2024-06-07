import chartsConfig from "../../configs/charts-config";


export function GetStatisticCharts (allSpendings){


  const getAllCategoryes = () => {
    const array = [];

    if (allSpendings.length > 0) {
      allSpendings.forEach((spending) => {
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

  const categoryData = getAllCategoryes()

  const getAllImproves = () => {

    let arrImprove = []
    let arrSpend = []
    categoryData.map((category) => {
      category.value.forEach((val) => {
        if(val && val.improve){
          arrImprove.push(val.improve)
        }
        else if(val && val.neimprove){
          arrSpend.push(val.neimprove)
        }
      })
    })

    let obj = {
      impoves: arrImprove,
      spends: arrSpend
    }
    return obj
  }
  const data = getAllImproves()


  const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: [],
        data: categoryData.map((category)=> category.value.cost),
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: categoryData.map((category)=> category.title),
      },
    },
  };



  const dailySalesChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Заработано",
        data: data.impoves,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: categoryData.map((category)=> category.title),
      },
    },
  };

  const completedTaskChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Sales",
        data: data.spends,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#ce0f0f"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: data.spends,
      },
    },
  };
  const completedTasksChart = {
    ...completedTaskChart,
    series: [
      {
        name: "Потрачено",
        data: data.spends,
      },
    ],
  };

   const statisticsChartsData = [
    {
      color: "white",
      title: "Категории",
      description: "Общая статистика по категориям",
      footer: "За все время",
      chart: websiteViewsChart,
    },
    {
      color: "white",
      title: "Расходы",
      description: "Статистика расходов",
      footer: "За все время",
      chart: completedTasksChart,
    },
    {
      color: "white",
      title: "Доходы",
      description: "Статистика доходов",
      footer: "За все время",
      chart: dailySalesChart,
    },
  ];


  return{
    statisticsChartsData

  }
}