import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';

export default function SelectMonth({ arrMonths, handleChange, currentMonth, label }) {
  return (
    <FormControl sx={{ my: 2, width: 180 }} size="small">
      <InputLabel id="select-month-category">{label}</InputLabel>

      <Select
        labelId="select-label"
        id="select-category"
        value={currentMonth}
        label={label}
        onChange={handleChange}
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

SelectMonth.propTypes = {
  currentMonth: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  arrMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
};
