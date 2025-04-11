import React, { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAPI } from '../context/mainContext';


export default function SelectCategory({rowIndex = null}) {
  const { arrCategories, handleChangeCategory, selectedCategory  } =  useAPI();

  return (
    <FormControl sx={{minWidth: '180px'}} size='small'>
      <InputLabel id='item-select-label'>Categoria</InputLabel>
      <Select
        labelId='item-select-label'
        id={`select-category-${rowIndex ?? 'default'}`}
        value={selectedCategory}
        label='Categoria'
        onChange={(e) =>
          rowIndex !== null
            ? handleChangeCategory(e.target.value, rowIndex)
            : handleChangeCategory(e.target.value)
        }
      >
        {(arrCategories || []).map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}