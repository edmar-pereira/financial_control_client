import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { v4 } from 'uuid';
import { useAPI } from '../context/mainContext';

export default function SelectMonth() {
  const { selectedMonth, arrMonths, handleChangeMonth, showTableView } =
    useAPI();

  const { month, year } = selectedMonth;

  const handleChange = (e) => {
    handleChangeMonth(e.target.value);
  };

  return (
    <FormControl sx={{ my: 2, width: 180 }} size='small'>
      <InputLabel id='select-month-category'>{'Selecionar mês'}</InputLabel>

      <Select
        labelId='select-label'
        id='select-category'
        value={`${month} - ${year}`}
        label={'Selecionar mês'}
        onChange={handleChange}
        size='small'
      >
        {arrMonths.map((item) => (
          <MenuItem key={`item-options-${v4()}`} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
