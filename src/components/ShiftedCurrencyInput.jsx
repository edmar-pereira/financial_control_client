import React from 'react';
import { TextField } from '@mui/material';

function formatCurrency(cents) {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export default function ShiftedCurrencyInput({ label, value, onChange, ...props }) {
  // value is always number of cents (integer)
  const cents = typeof value === 'number' ? value : 0;

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) return;

    e.preventDefault();

    if (e.key >= '0' && e.key <= '9') {
      // Add digit at the end (rightmost = cents)
      const newValue = cents * 10 + parseInt(e.key, 10);
      onChange(newValue);
    } else if (e.key === 'Backspace') {
      // Remove last digit
      const newValue = Math.floor(cents / 10);
      onChange(newValue);
    } else if (e.key === 'Delete') {
      onChange(0);
    }
  };

  return (
    <TextField
      label={label}
      value={formatCurrency(cents)}
      onKeyDown={handleKeyDown}
      onChange={() => {}}
      inputMode="numeric"
      variant="outlined"
      {...props}
    />
  );
}
