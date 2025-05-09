import React, { useState, useEffect } from 'react';
import { useAPI } from '../context/mainContext';
import PieChart from '../components/charts/pieChart';
import BarChartComparativo from '../components/charts/barChartComparativo';
import { Typography, Box } from '@mui/material';

function Graphic() {
  const { selectedMonth, arrCategories, currentMonth, selectedDate } = useAPI();

  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [title, setTitle] = useState('');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const formatMonth = (isoDate) => {
    const date = new Date(isoDate);
    return `${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const MoneyFormat = (value) => {
    return value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  useEffect(() => {
    if (!currentMonth.expenses || !selectedDate || !arrCategories) return;

    const plannedCategories = arrCategories.filter(
      (c) => !['revenue', 'uncategorized'].includes(c.id)
    );

    const actualByCategory = {};
    let totalExpenses = 0;

    currentMonth.expenses.forEach((exp) => {
      if (!actualByCategory[exp.categoryId]) {
        actualByCategory[exp.categoryId] = 0;
      }
      actualByCategory[exp.categoryId] += exp.value;
      totalExpenses += exp.value;
    });

    const labels = [];
    const plannedValues = [];
    const actualValues = [];
    const pieData = [];
    const colors = [];

    plannedCategories.forEach((category) => {
      const actual = actualByCategory[category.id] || 0;
      const percentage = totalExpenses ? (actual / totalExpenses) * 100 : 0;

      labels.push(category.label);
      plannedValues.push(category.maxValue);
      actualValues.push(actual);
      pieData.push(percentage.toFixed(1)); // % of actual expense
      colors.push(category.color || '#888');
    });

    setTitle(`Despesas - ${formatMonth(selectedDate)}`);

    setBarChartData({
      labels,
      datasets: [
        {
          label: 'Planejado',
          data: plannedValues,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
        {
          label: 'Gasto Real',
          data: actualValues,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
      ],
    });

    setPieChartData({
      labels,
      datasets: [
        {
          label: '% do Gasto Real',
          data: pieData,
          backgroundColor: colors,
        },
      ],
    });
  }, [selectedMonth, arrCategories]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h6' mb={2}>{title}</Typography>

      <Box sx={{ width: '50%', mx: 'auto' }}>
        {pieChartData && (
          <Box mb={4}>
            <PieChart
              chartData={pieChartData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const label = pieChartData.labels[tooltipItem.dataIndex];
                        const value = pieChartData.datasets[0].data[tooltipItem.dataIndex];
                        const actual = currentMonth.expenses
                          .filter((exp) => exp.categoryId === tooltipItem.index)
                          .reduce((sum, exp) => sum + exp.value, 0);
                        return `${label}: ${MoneyFormat(actual)} (${value}%)`;
                      },
                    },
                  },
                  legend: {
                    position: 'bottom',
                    labels: {
                      generateLabels: (chart) => {
                        return chart.data.labels.map((label, index) => ({
                          text: `${label}: ${MoneyFormat(pieChartData.datasets[0].data[index])}`,
                          fillStyle: pieChartData.datasets[0].backgroundColor[index],
                          index,
                        }));
                      },
                    },
                  },
                  datalabels: {
                    display: true,
                    formatter: (value) => `${value}%`,
                    color: '#fff',
                  },
                },
              }}
            />
          </Box>
        )}

        {barChartData && (
          <Box>
            <BarChartComparativo chartData={barChartData} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Graphic;
