import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
} from '@mui/material';

import axios from 'axios';
import { useState, useEffect } from 'react';

export default function EditCompanyModal({ row, onClose, reload }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (row) setForm(row);
  }, [row]);

  if (!row) return null;

  const handleSave = async () => {
    await axios.put(`/api/company-info/${row._id}`, form);

    reload();
    onClose();
  };

  return (
    <Dialog open={!!row} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Editar Empresa</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label='Nome Fantasia'
            value={form.fantasyName || ''}
            onChange={(e) => setForm({ ...form, fantasyName: e.target.value })}
          />

          <TextField
            label='Nome Empresa'
            value={form.companyName || ''}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />

          <TextField
            label='Tipo Pagamento'
            value={form.categoryId || ''}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          />

          <Button variant='contained' onClick={handleSave}>
            Salvar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
