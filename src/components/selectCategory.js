import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAPI } from '../context/mainContext';
import { useParams } from 'react-router-dom';

export default function SelectCategory({ rowIndex, selectedType, onChange }) {
  const { arrCategories } = useAPI();
  const param = useParams();

  const filteredCategories =
    param.id !== undefined
      ? arrCategories.filter(
          (expense) => !['all_categories'].includes(expense.id),
        )
      : arrCategories;

  return (
    <FormControl size='small' fullWidth>
      <InputLabel id={`item-select-label-${rowIndex ?? 'default'}`}>
        Categoria
      </InputLabel>

      <Select
        labelId={`item-select-label-${rowIndex ?? 'default'}`}
        id={`select-category-${rowIndex ?? 'default'}`}
        value={selectedType ?? ''}
        label='Categoria'
        onChange={(e) => onChange?.(e.target.value)}
      >
        {filteredCategories.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
