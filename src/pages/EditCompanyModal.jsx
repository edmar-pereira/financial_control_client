import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAPI } from '../context/mainContext';

import SelectCategory from '../components/SelectCategory';

export default function EditCompanyModal({ row, onClose, reload }) {
  const [form, setForm] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');

  const { setMessage } = useAPI();

  useEffect(() => {
    if (row) {
      setForm(row);
      setSelectedCategory(row.categoryId);
    }
  }, [row]);

  if (!row) return null;

  const handleSave = async () => {
    try {
      const payload = [
        {
          id: row._id,
          fantasyName: form.fantasyName,
          companyName: form.companyName,
          categoryId: selectedCategory,
        },
      ];

      console.log('Sending payload:', payload);

      const response = await api.put('/api/category/updateCategory', payload);

      if (response.data.status === 200) {
        setMessage({
          severity: 'success',
          content: 'Categoria atualizada com sucesso!',
          show: true,
        });
      } else {
        setMessage({
          severity: 'error',
          content: 'Erro ao atualizar categoria',
          show: true,
        });
        return;
      }

      reload();
      onClose();
    } catch (error) {
      console.error('Error updating category:', error);
    }
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

          {/* Dropdown de categoria */}
          <SelectCategory
            selectedType={selectedCategory}
            onChange={setSelectedCategory}
          />

          <Button variant='contained' onClick={handleSave}>
            Salvar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
