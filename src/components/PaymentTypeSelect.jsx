import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const PAYMENT_TYPES = [
  'DEBITO VISA ELECTRON BRASIL',
  'PIX ENVIADO',
  'PIX RECEBIDO',
  'SAQUE DINHEIRO',
  'BOLETO',
];

export default function PaymentTypeSelect({
  value,
  onChange,
  error = false,
  helperText = '',
  disabled = false,
}) {
  return (
    <FormControl fullWidth size="small" error={error} disabled={disabled}>
      <InputLabel id="payment-type-label">
        Tipo de pagamento
      </InputLabel>

      <Select
        labelId="payment-type-label"
        label="Tipo de pagamento"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {PAYMENT_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
