import React, { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAPI } from '../context/mainContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function SelectCategory({ rowIndex = null, selectedType }) {
  const { arrCategories, handleChangeCategory } = useAPI();
  const param = useParams();
  let filteredCategories = [];

  if (param.id !== undefined) {
    filteredCategories = arrCategories.filter(
      (expense) => !['all_categories'].includes(expense.id)
    );
  } else {
    filteredCategories = arrCategories;
  }

  return (
    <FormControl
      size='small'
      sx={{
        minWidth: 140,
        // maxWidth: 200,
        width: { xs: '100%', sm: 'auto' }, // 100% on mobile, auto on desktop
      }}
    >
      <InputLabel id='item-select-label'>Categoria</InputLabel>
      <Select
        labelId='item-select-label'
        id={`select-category-${rowIndex ?? 'default'}`}
        value={selectedType || ''}
        label='Categoria'
        onChange={(e) =>
          rowIndex !== null
            ? handleChangeCategory(e.target.value, rowIndex)
            : handleChangeCategory(e.target.value)
        }
      >
        {(filteredCategories || []).map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
