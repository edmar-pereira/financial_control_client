import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Autocomplete,
} from '@mui/material';
import api from '../services/api';
import { useAPI } from '../context/mainContext';

const EMPTY_FILTERS = {
  startDate: '',
  endDate: '',
  categoryIds: [],
  descriptionsText: '',
  min: '',
  max: '',
};

export default function AdvancedSearch({
  open,
  onClose,
  arrCategories = [],
  setTransactions,
}) {
  const { setMessage } = useAPI();
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const set = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleSearch = async () => {
    if (!filters.startDate) {
      setMessage({
        severity: 'warning',
        content: 'Informe a data inicial.',
        show: true,
      });
      return;
    }

    try {
      const payload = {
        startDate: filters.startDate,
        endDate: filters.endDate || undefined,
        categoryIds: filters.categoryIds,
        descriptions: filters.descriptionsText
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
        valuesRange: {
          min: filters.min === '' ? null : Number(filters.min),
          max: filters.max === '' ? null : Number(filters.max),
        },
      };

      const response = await api.post('/api/data/getData', payload);

      setTransactions(response.data.data);
      document.activeElement?.blur(); // evita o aviso de aria-hidden ao fechar
      onClose();
    } catch (error) {
      console.error('Search error:', error);

      setMessage({
        severity: 'error',
        content: error.response?.data?.error || 'Erro ao pesquisar',
        show: true,
      });
    }
  };

  const handleClear = () => setFilters(EMPTY_FILTERS);

  const selectableCategories = arrCategories.filter(
    (c) => c.id !== 'all_categories',
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Pesquisa avançada</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label='Data inicial'
            type='date'
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />

          <TextField
            label='Data final'
            type='date'
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />

          <Autocomplete
            multiple
            options={selectableCategories}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectableCategories.filter((c) =>
              filters.categoryIds.includes(c.id),
            )}
            onChange={(e, value) =>
              set(
                'categoryIds',
                value.map((v) => v.id),
              )
            }
            renderInput={(params) => (
              <TextField {...params} label='Categorias' />
            )}
          />

          <TextField
            label='Descrição (separar por vírgula)'
            placeholder='mercado,lopes,padaria'
            value={filters.descriptionsText}
            onChange={(e) => set('descriptionsText', e.target.value)}
          />

          <Stack direction='row' spacing={2}>
            <TextField
              label='Valor mínimo'
              type='number'
              fullWidth
              value={filters.min}
              onChange={(e) => set('min', e.target.value)}
            />

            <TextField
              label='Valor máximo'
              type='number'
              fullWidth
              value={filters.max}
              onChange={(e) => set('max', e.target.value)}
            />
          </Stack>

          <Stack direction='row' spacing={2} justifyContent='flex-end'>
            <Button onClick={handleClear} color='secondary'>
              Limpar
            </Button>

            <Button variant='contained' onClick={handleSearch}>
              Buscar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}