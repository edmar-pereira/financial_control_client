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

      const response = await api.put(
        '/api/category/updateCategoryInfo',
        payload,
      );

      if (response.data.status !== 200) {
        setMessage({
          severity: 'error',
          content: 'Erro ao atualizar cadastro',
          show: true,
        });
        return;
      }

      setMessage({
        severity: 'success',
        content: 'Cadastro atualizado com sucesso!',
        show: true,
      });

      reload?.();
      onClose();
    } catch (error) {
      console.error('Error updating category info:', error);

      const duplicated = error.response?.data?.error?.includes('E11000');

      setMessage({
        severity: 'error',
        content: duplicated
          ? 'Já existe um cadastro com esse Nome Fantasia.'
          : 'Erro ao atualizar cadastro',
        show: true,
      });
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