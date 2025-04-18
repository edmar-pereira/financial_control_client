import React, { useState, useEffect } from 'react';
import { useAPI } from '../context/mainContext';
import SelectMonth from '../components/selectMonth';
import BarChart from '../components/charts/barChart';
import PieChart from '../components/charts/pieChart';
import {
  IconButton,
  Typography,
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

function Graphic() {
  const { selectedMonth, arrCategories, currentMonth, selectedDate } = useAPI();
  // const { expenses, selectedDate } = selectedMonth;

  const [chartType, setChartType] = useState('pie');
  const [chartData, setChartData] = useState(null);
  const [title, setTitle] = useState('');

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const formatMonth = (isoDate) => {
    const date = new Date(isoDate);
    return `${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const handleChartTypeChange = (_, newType) => {
    if (newType !== null) setChartType(newType);
  };

  useEffect(() => {
    if (!currentMonth.expenses || !selectedDate || !arrCategories) return;

    const planned = arrCategories.filter(
      (c) => !['revenue', 'uncategorized'].includes(c.id)
    );
    const actualByCategory = {};

    currentMonth.expenses.forEach((exp) => {
      if (!actualByCategory[exp.categoryId]) {
        actualByCategory[exp.categoryId] = 0;
      }
      actualByCategory[exp.categoryId] += exp.value;
    });

    const labels = [];
    const plannedValues = [];
    const actualValues = [];
    const colors = [];

    planned.forEach((category) => {
      labels.push(category.label);
      plannedValues.push(category.maxValue);
      actualValues.push(actualByCategory[category.id] || 0);
      colors.push(category.color);
    });

    setTitle(`Despesas ${formatMonth(selectedDate)}`);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Planejado',
          data: plannedValues,
          backgroundColor: colors,
        },
        {
          label: 'Gasto Real',
          data: actualValues,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    });
  }, [selectedMonth, arrCategories]);

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>{title}</Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size='small'
        >
          <ToggleButton value='pie'>
            <PieChartIcon />
          </ToggleButton>
          <ToggleButton value='bar'>
            <BarChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {chartData && chartType === 'pie' && <PieChart chartData={chartData} />}
      {chartData && chartType === 'bar' && <BarChart chartData={chartData} />}
    </Box>
  );
}

export default Graphic;
