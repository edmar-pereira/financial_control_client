import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChartComparativo({ chartData }) {
  const options = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top' },
      title: {
        display: false,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}