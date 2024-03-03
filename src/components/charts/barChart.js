import React from 'react';
import { Bar } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import PropTypes from 'prop-types';

export default function BarChart({ chartData }) {
  return <Bar data={chartData} />;
}

BarChart.propTypes = {
  chartData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
