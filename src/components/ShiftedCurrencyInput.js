import React from "react";
import { TextField } from "@mui/material";

function formatCurrency(c) {
  const reais = Math.floor(c / 100);
  const centavos = c % 100;
  return `R$ ${reais.toLocaleString("pt-BR")},${centavos.toString().padStart(2, "0")}`;
}

export default function ShiftedCurrencyInput({ label, value, onChange, ...props }) {
  const handleKeyDown = (e) => {
    e.preventDefault();

    if (e.key >= "0" && e.key <= "9") {
      onChange(value * 10 + parseInt(e.key));
    } else if (e.key === "Backspace") {
      onChange(Math.floor(value / 10));
    }
  };

  return (
    <TextField
      label={label}
      value={formatCurrency(value)}
      onKeyDown={handleKeyDown}
      onChange={() => {}}
      inputMode="numeric"
      variant="outlined"
      {...props}
    />
  );
}
