import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
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

export default function BarChart({ transactions, categories }) {
  function MoneyFormat(valueToFormat) {
    return valueToFormat.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  const chartData = useMemo(() => {
    const filteredCategories = categories.filter(
      (cat) =>
        ![
          'credit_card',
          'revenue',
          'all_categories',
          'uncategorized',
          'stocks',
          'children',
        ].includes(cat.id)
    );

    const labels = [];
    const data = [];
    const backgroundColor = [];
    const extraData = [];

    function getColor(percentage) {
      if (percentage <= 0) return '#f44336';
      if (percentage <= 50) return '#4caf50';
      if (percentage <= 100) return '#ffc107';
      return '#f44336';
    }

    filteredCategories.forEach((category) => {
      const transInCategory = transactions.filter(
        (t) => t.categoryId === category.id
      );
      const total = transInCategory.reduce((sum, t) => sum + t.value, 0);
      const percentage = category.maxValue
        ? ((total / category.maxValue) * 100).toFixed(1)
        : 0;
      labels.push(`${category.label} ${percentage}%`);
      data.push(total);
      backgroundColor.push(getColor(percentage));
      extraData.push(category.maxValue || 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Gastos',
          data,
          backgroundColor,
          arrExtraData: extraData,
        },
      ],
    };
  }, [transactions, categories]);

  const options = {
    responsive: true,
    aspectRatio: window.screen.width >= 1280 ? 2 : 1,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const expense = tooltipItem.raw;
            const monthIndex = tooltipItem.dataIndex;
            const expenseEst = chartData.datasets[0].arrExtraData[monthIndex];

            return [
              `Gasto total: ${MoneyFormat(expense)}`,
              `Gasto estimado: ${MoneyFormat(expenseEst)}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        width: '100%',
        height: window.innerWidth >= 600 ? '500px' : '300px', // mobile vs web
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
}

BarChart.propTypes = {
  transactions: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};
