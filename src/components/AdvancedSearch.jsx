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

export default function AdvancedSearch({
  open,
  onClose,
  arrCategories,
  setTransactions,
}) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryIds: [],
    descriptions: [],
    valuesRange: {
      min: '',
      max: '',
    },
  });

  const handleSearch = async () => {
    try {
      const payload = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        categoryIds: filters.categoryIds,
        descriptions: filters.descriptions,
        valuesRange: {
          min: filters.valuesRange.min,
          max: filters.valuesRange.max,
        },
      };

      console.log('Search payload:', payload);

      const response = await api.post('/api/data/getData', payload);

      setTransactions(response.data.data);
      onClose();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleClear = () => {
    setFilters({
      startDate: '',
      endDate: '',
      categoryIds: [],
      descriptions: [],
      valuesRange: {
        min: '',
        max: '',
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Pesquisa avançada</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Datas */}
          <TextField
            label='Data inicial'
            type='date'
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />

          <TextField
            label='Data final'
            type='date'
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />

          {/* Categorias */}
          <Autocomplete
            multiple
            options={arrCategories}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) =>
              setFilters({
                ...filters,
                categoryIds: value.map((v) => v.id),
              })
            }
            renderInput={(params) => (
              <TextField {...params} label='Categorias' />
            )}
          />

          {/* Descrição */}
          <TextField
            label='Descrição (separar por vírgula)'
            placeholder='mercado,lopes,padaria'
            onChange={(e) =>
              setFilters({
                ...filters,
                descriptions: e.target.value
                  .split(',')
                  .map((d) => d.trim())
                  .filter(Boolean),
              })
            }
          />

          {/* Valores */}
          <Stack direction='row' spacing={2}>
            <TextField
              label='Valor mínimo'
              type='number'
              fullWidth
              value={filters.valuesRange.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  valuesRange: {
                    ...filters.valuesRange,
                    min: Number(e.target.value),
                  },
                })
              }
            />

            <TextField
              label='Valor máximo'
              type='number'
              fullWidth
              value={filters.valuesRange.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  valuesRange: {
                    ...filters.valuesRange,
                    max: Number(e.target.value),
                  },
                })
              }
            />
          </Stack>

          {/* Botões */}
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
