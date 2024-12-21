import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import MainTableComponent from '../components/mainTableComponent';
import MainCardComponent from '../components/mainCardComponent';
import DateBox from '../components/dateBox';
import { useAPI } from '../context/mainContext';
import SelectMonth from '../components/selectMonth';
import SelectCategory from '../components/selectCategory';

export default function Main() {
  const {
    selectedMonth,
    arrMonths,
    handleChangeMonth,
    showTableView
  } = useAPI();

  const { month, year, expenses, pageInfo } = selectedMonth;

  const handleChange = (e) => {
    handleChangeMonth(e.target.value);
  };



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SelectMonth
          arrMonths={arrMonths}
          handleChange={handleChange}
          currentMonth={`${month} - ${year}`}
          label='Selecionar mês'
        />
        <SelectCategory />
      </div>
      {expenses?.length === 0 ? (
        <div
          style={{
            height: '200px',
            textAlign: 'center',
            width: '100%',
            marginTop: '50px',
          }}
        >
          <Typography variant='body2'>
            Não foi possível carregar suas finanças
          </Typography>
        </div>
      ) : (
        <div>
          {!showTableView ? (
            <DateBox
              info={
                pageInfo !== undefined ? `${pageInfo}` : `${month} - ${year}`
              }
            />
          ) : null}


          {showTableView ? <MainTableComponent /> : <MainCardComponent />}
        </div>
      )}
    </div>
  );
}
