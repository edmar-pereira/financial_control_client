import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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
  // Always normalize to Date
  const parsedDate = currentDate ? new Date(currentDate) : new Date();

  const selectedYear = parsedDate.getFullYear();
  const selectedMonth = parsedDate.getMonth() + 1;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const updateDate = (year, month) => {
    const newDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
    handleChangeDate(newDate);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      {/* YEAR */}
      <FormControl size='small' sx={{ minWidth: 120 }}>
        <InputLabel>Ano</InputLabel>
        <Select
          value={years.includes(selectedYear) ? selectedYear : ''}
          label='Ano'
          onChange={(e) => updateDate(Number(e.target.value), selectedMonth)}
        >
          {years.map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* MONTH */}
      <FormControl size='small' sx={{ minWidth: 140 }}>
        <InputLabel>Mês</InputLabel>
        <Select
          value={selectedMonth}
          label='Mês'
          onChange={(e) => updateDate(selectedYear, Number(e.target.value))}
        >
          {monthsBR.map((mes, index) => (
            <MenuItem key={mes} value={index + 1}>
              {mes}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
