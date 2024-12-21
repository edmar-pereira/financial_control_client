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
  const dateRegex = /^\d{4}-\d{2}$/;

  function MoneyFormat(valueToFormat) {
    return valueToFormat.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

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
            if (tooltipItem) {
            }

            if (!dateRegex.test(chartData.labels[0])) {
              const expense = tooltipItem.raw;
              const monthIndex = tooltipItem.dataIndex;
              const expenseEst = data.extraData.profit[monthIndex];

              return [
                `Gasto total: ${MoneyFormat(expense)}`,
                `Gasto estimado: ${MoneyFormat(expenseEst)}`,
              ];
            }
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} style={{ height: '600' }} />;
}

BarChart.propTypes = {
  chartData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
