import React from 'react';
import { Pie } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import PropTypes from 'prop-types';

export default function PieChart({ chartData }) {
  return <Pie data={chartData} />;
}

PieChart.propTypes = {
  chartData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
