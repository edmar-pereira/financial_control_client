import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import MainTableComponent from '../components/mainTableComponent';
import MainCardComponent from '../components/mainCardComponent';
import DateBox from '../components/dateBox';
import { useAPI } from '../context/mainContext';
import SelectMonth from '../components/selectMonth';
import SelectCategory from '../components/selectCategory';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import { IconButton } from '@mui/material';

export default function Main() {
  const {
    selectedMonth,
    arrMonths,
    handleChangeMonth,
    arrCategory,
    handleChangeCategory,
    currentCategory,
  } = useAPI();

  const filteredCategory = arrCategory.filter(
    (item) => item !== 'Cartão de Crédito' && item !== 'Filhos'
  );

  const { month, year, expenses, pageInfo } = selectedMonth;
  const [showTableView, setShowTableView] = useState(true);

  const handleChange = (e) => {
    handleChangeMonth(e.target.value);
  };

  const changeCategory = (e) => {
    handleChangeCategory(e.target.value);
  };

  const handleChangeViewType = () => {
    setShowTableView(!showTableView);
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
        <SelectCategory
          arrCategory={filteredCategory}
          changeCategory={changeCategory}
          currentCategory={currentCategory}
        />
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
          <DateBox
            info={pageInfo !== undefined ? `${pageInfo}` : `${month} - ${year}`}
          />
          {showTableView ? (
            <IconButton onClick={() => handleChangeViewType()}>
              <TableChartIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleChangeViewType()}>
              <ViewListIcon />
            </IconButton>
          )}
          {showTableView ? <MainTableComponent /> : <MainCardComponent />}
        </div>
      )}
    </div>
  );
}
