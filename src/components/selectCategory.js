import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';

export default function SelectCategory({ arrCategory, changeCategory, currentCategory }) {
  return (
    <FormControl sx={{ my: 2, width: 180 }} size="small">
      <InputLabel id="item-select-label">Categoria</InputLabel>

      <Select
        labelId="item-select-label"
        id="select-category"
        value={currentCategory}
        label="Categoria"
        onChange={changeCategory}
      >
        {arrCategory.map((item) => (
          <MenuItem key={`item-options-${v4()}`} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SelectCategory.propTypes = {
  currentCategory: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  arrCategory: PropTypes.arrayOf(PropTypes.string).isRequired,
};
