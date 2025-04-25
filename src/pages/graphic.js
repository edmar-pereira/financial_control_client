import React, { useState, useEffect } from 'react';
import { useAPI } from '../context/mainContext';
import PieChart from '../components/charts/pieChart';
import BarChartComparativo from '../components/charts/barChartComparativo';
import { Typography, Box, Grid } from '@mui/material';

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
    const legendLabels = [];

    plannedCategories.forEach((category) => {
      const actual = actualByCategory[category.id] || 0;
      const percentage = totalExpenses ? (actual / totalExpenses) * 100 : 0;

      labels.push(category.label);
      plannedValues.push(category.maxValue);
      actualValues.push(actual);
      pieData.push(percentage.toFixed(1));  // Mostrar a porcentagem do gasto real
      colors.push(category.color || '#888');

      // Modificando a legenda para mostrar a categoria e o valor gasto
      legendLabels.push(`${category.label}: ${MoneyFormat(actual)}`);
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

      <Box sx={{ width: '70%', mx: 'auto' }}>
        <Grid container spacing={2}>
          {/* Gráfico de Pizza - Ocupando 50% da largura */}
          <Grid item xs={12} md={6}>
            {pieChartData && (
              <PieChart
                chartData={pieChartData}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const label = pieChartData.labels[tooltipItem.dataIndex];
                          const value = pieChartData.datasets[0].data[tooltipItem.dataIndex];
                          const actual = currentMonth.expenses.filter(
                            (exp) => exp.categoryId === tooltipItem.index
                          ).reduce((sum, exp) => sum + exp.value, 0);
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
                      formatter: (value, context) => {
                        return `${value}%`;  // Exibindo a porcentagem
                      },
                      color: '#fff',
                    },
                  },
                }}
              />
            )}
          </Grid>

          {/* Gráfico de Barras - Ocupando 70% da largura */}
          <Grid item xs={12} md={6}>
            {barChartData && (
              <BarChartComparativo chartData={barChartData} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Graphic;
