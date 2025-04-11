import React, { useState, useEffect } from 'react';
import { useAPI } from '../context/mainContext';
import SelectMonth from '../components/selectMonth';
import SelectCategory from '../components/selectCategory';
import BarChart from '../components/charts/barChart';
import PieChart from '../components/charts/pieChart';
import DateBox from '../components/dateBox';
import './styles.css';

function Graphic() {
  const { selectedMonth, expensesType, handleChangeMonth } =
    useAPI();

  const { expenses, totalExp, totalRev } = selectedMonth;

  const handleChange = (e) => {
    handleChangeMonth(e.target.value);
  };

  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Despesas',
        data: [],
        backgroundColor: [],
        arrExtraData: [],
      },
    ],
  });

  const [expRev, setExpRev] = useState({
    labels: '',
    datasets: [
      {
        label: '',
        data: [],
      },
      {
        label: '',
        data: [],
      },
    ],
  });

  async function getVal(val) {
    const dataFiltered = expenses.filter((e) => e.type === val);
    return dataFiltered;
  }

  const GetExpensesValues = async () => {
    const categoryTotal = [];
    const color = [];
    const extraData = [];
    let i = 0;

    let unique = [...new Set(expenses.map((e) => e.type))];

    unique = unique.filter((e) => e !== 'Receita');

    (async function GetExpenses() {
      for (const num of unique) {
        const filteredType = await getVal(num);

        const categorySum = filteredType.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);

        const currObj = expensesType.filter((item) => item.label === num);

        categoryTotal.push(categorySum);

        color.push(currObj[0].color);

        extraData.push(currObj[0].maxValue);

        unique[i] = `${unique[i]} R$${categorySum.toFixed(2)}`;

        i += 1;
      }
    })().then(() => {
      setUserData({
        labels: unique,
        datasets: [
          {
            label: 'Despesas',
            data: categoryTotal,
            backgroundColor: color,
            arrExtraData: extraData,
          },
        ],
      });
    });
  };

  const GetExpectedRevenue = () => {
    const label = [...new Set(expenses.map((e) => e.date.substring(0, 7)))];

    setExpRev({
      labels: label,
      datasets: [
        {
          label: 'Receitas',
          data: [totalRev],
        },
        {
          label: 'Gastos',
          data: [totalExp],
        },
      ],
    });
  };

  useEffect(() => {
    if (Object.keys(selectedMonth).length > 0) {
      GetExpensesValues();
      GetExpectedRevenue();
    }
  }, [selectedMonth]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SelectMonth />

        <SelectCategory />
      </div>
      <div className='container'>
        <div className='container-bar'>
          <DateBox selectedDate={`Despesas mês ${selectedMonth.month}`} />
          <BarChart chartData={userData} />
        </div>

        <div className='container-pizza'>
          <PieChart chartData={userData} />
        </div>

        <div className='container-bar-exp'>
          <BarChart chartData={expRev} />
        </div>
      </div>
    </div>
  );
}

export default Graphic;
