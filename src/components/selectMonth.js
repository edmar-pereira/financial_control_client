import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState, useEffect } from 'react';

const monthsBR = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function SelectMonth({ currentDate, handleChangeDate }) {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // getMonth is 0-indexed

  const years = [2025, 2024, 2023];

  useEffect(() => {
    const formattedDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1)).toISOString();
    handleChangeDate(formattedDate);
  }, [selectedYear, selectedMonth]);

  return (
    <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
      {/* Year Selector */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="select-year-label">Ano</InputLabel>
        <Select
          labelId="select-year-label"
          id="select-year"
          value={selectedYear}
          label="Ano"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Month Selector */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="select-month-label">Mês</InputLabel>
        <Select
          labelId="select-month-label"
          id="select-month"
          value={monthsBR[selectedMonth - 1]}
          label="Mês"
          onChange={(e) => {
            const monthIndex = monthsBR.indexOf(e.target.value) + 1;
            setSelectedMonth(monthIndex);
          }}
        >
          {monthsBR.map((mes) => (
            <MenuItem key={mes} value={mes}>
              {mes}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
