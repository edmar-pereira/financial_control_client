import React from 'react';
import { Bar } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import PropTypes from 'prop-types';

export default function BarChart({ chartData }) {
  const options = {
    indexAxis: 'y',
    // aspectRatio: 1, // this would be a 1:1 aspect ratio
    
    // maintainAspectRatio: false,
  };
  return <Bar data={chartData} options={options} />;
}

BarChart.propTypes = {
  chartData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
