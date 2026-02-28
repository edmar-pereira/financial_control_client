// import React, { useEffect, useState } from 'react';
// import Typography from '@mui/material/Typography';
import MainTableComponent from '../components/mainTableComponent';
import MainCardComponent from '../components/mainCardComponent';
// import DateBox from '../components/dateBox';
import { useAPI } from '../context/mainContext';
// import SelectMonth from '../components/selectMonth';
// import SelectCategory from '../components/selectCategory';

export default function Main() {
  const { showTableView } = useAPI();
  return (
    <div>
      <div>
        {showTableView ? <MainTableComponent /> : <MainCardComponent />}
      </div>
    </div>
  );
}
