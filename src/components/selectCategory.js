import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { v4 } from 'uuid';
import { useAPI } from '../context/mainContext';

export default function SelectCategory() {
  const {
    expensesType,
    handleChangeCategory,
    currentCategory,
  } = useAPI();

  const changeCategory = (e) => {
    handleChangeCategory(e.target.value);
  };
  return (
    <FormControl sx={{ my: 2, width: 180 }} size='small'>
      <InputLabel id='item-select-label'>Categoria</InputLabel>

      <Select
        labelId='item-select-label'
        id='select-category'
        value={currentCategory}
        label='Categoria'
        onChange={changeCategory}
      >
        {expensesType.map((item) => (
          <MenuItem key={`item-options-${v4()}`} value={item.label}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

