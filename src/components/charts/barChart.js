import React, { useMemo, useState, useEffect } from 'react';
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
  const arrItems = [];
  const [height, setHeight] = useState(getHeight());

  useEffect(() => {
    function handleResize() {
      setHeight(getHeight());
    }

    console.log(getHeight());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function MoneyFormat(valueToFormat) {
    return valueToFormat.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function getHeight() {
    // return window.innerWidth >= 600 ? 500 : 300;
    return window.innerWidth = 500;
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
      arrItems.push(transInCategory); // ← armazenando as transações
    });

    return {
      labels,
      datasets: [
        {
          label: 'Gastos',
          data,
          backgroundColor,
          arrExtraData: extraData,
          arrItems,
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
            const index = tooltipItem.dataIndex;
            const expenseEst = chartData.datasets[0].arrExtraData[index];
            const items = chartData.datasets[0].arrItems[index];

            const itemDescriptions = items.map(
              (t) =>
                `- ${t.description || 'Sem descrição'}: ${MoneyFormat(t.value)}`
            );

            return [
              `Gasto total: ${MoneyFormat(expense)}`,
              `Gasto estimado: ${MoneyFormat(expenseEst)}`,
              'Detalhes:',
              ...itemDescriptions,
            ];
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

BarChart.propTypes = {
  transactions: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};
