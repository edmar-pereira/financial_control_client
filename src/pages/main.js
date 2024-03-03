import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CardComponent from '../components/card';
import DateBox from '../components/dateBox';
import { useAPI } from '../context/mainContext';
import SelectMonth from '../components/selectMonth';
import SelectCategory from '../components/selectCategory';

export default function Main() {
  const {
    selectedMonth,
    arrMonths,
    handleChangeMonth,
    arrCategory,
    handleChangeCategory,
    currentCategory,
  } = useAPI();

  const { month, year, expenses } = selectedMonth;

  const handleChange = (e) => {
    handleChangeMonth(e.target.value);
  };

  const changeCategory = (e) => {
    handleChangeCategory(e.target.value);
  };

  return (
    <div>
      {selectedMonth.length === 0 ? (
        <div style={{ height: '200px', textAlign: 'center', width: '100%', marginTop: '50px' }}>
          <Typography variant="body2">Não foi possível carregar suas finanças</Typography>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <SelectMonth
              arrMonths={arrMonths}
              handleChange={handleChange}
              currentMonth={`${month} - ${year}`}
              label="Selecionar mês"
            />
            <SelectCategory
              arrCategory={arrCategory}
              changeCategory={changeCategory}
              currentCategory={currentCategory}
            />
          </div>
          <DateBox selectedDate={`${month} - ${year}`} />
          <List sx={{ bgcolor: 'background.paper', maxWidth: '650px', margin: 'auto' }}>
            {expenses?.map((value) => {
              return <CardComponent data={value} key={value._id} />;
            })}
          </List>
        </div>
      )}
    </div>
  );
}
