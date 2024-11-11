import React from 'react';
import { Bar } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import PropTypes from 'prop-types';

export default function BarChart({ chartData }) {

  function MoneyFormat(valueToFormat) {
    return valueToFormat.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  // console.log(chartData.datasets[0].label)

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: chartData.datasets[0].label,
        data: chartData.datasets[0].data,
        backgroundColor: chartData.datasets[0].backgroundColor,
        // borderColor: chartData.datasets[0].backgroundColor,
        // borderWidth: 1,
      },
    ],
    // Additional data that we want to display in the tooltip
    extraData: {
      profit: chartData.datasets[0].arrExtraData,
    },
  };

  const options = {
    responsive: true,
    aspectRatio: window.screen.width >= 1280 ? 2 : 1,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: '',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const expense = tooltipItem.raw;
            const monthIndex = tooltipItem.dataIndex;
            const expenseEst = data.extraData.profit[monthIndex];
            return [`Gasto total: ${MoneyFormat(expense)}`, `Gasto estimado: ${MoneyFormat(expenseEst)}`];
          },
        },
      },
    },
  };

  // if (window.screen.width >= 1280) {
  //   options = {
  //     indexAxis: 'y',
  //     // aspectRatio: 1, // this would be a 1:1 aspect ratio
  //     // maintainAspectRatio: false,
  //   };
  // } else {
  //   console.log('mobile');
  //   options = {
  //     indexAxis: 'y',
  //     aspectRatio: 1, // this would be a 1:1 aspect ratio
  //   };
  // }



  return <Bar data={data} options={options} style={{ height: '600' }} />;
}

BarChart.propTypes = {
  chartData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
