import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import api from '../services/api';

/**
 * Autocomplete de Nome Fantasia / Nome da Empresa.
 *
 * field          'fantasyName' | 'companyName'
 * value          texto atual do campo (string)
 * onTextChange   chamado a cada digitação, com o texto
 * onSelectOption chamado ao escolher uma sugestão, com { fantasyName, companyName }
 */
export default function CompanyAutocomplete({
  field = 'fantasyName',
  label,
  value = '',
  onTextChange,
  onSelectOption,
  size = 'small',
  fullWidth = true,
}) {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search.trim().length < 2) {
      setOptions([]);
      return;
    }

    let active = true;

    const debounce = setTimeout(async () => {
      try {
        const res = await api.get('/api/data/getUniqueCompanies', {
          params: { value: search.trim(), field },
        });

        if (active && Array.isArray(res.data.data)) {
          setOptions(res.data.data);
        }
      } catch (err) {
        console.error('Erro ao buscar sugestões', err);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [search, field]);

  // remove vazios e repetidos (a mesma empresa pode ter vários nomes fantasia)
  const uniqueOptions = useMemo(() => {
    const seen = new Set();

    return options.filter((option) => {
      const key = (option[field] || '').trim();

      if (!key || seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [options, field]);

  return (
    <Autocomplete
      freeSolo
      fullWidth={fullWidth}
      size={size}
      options={uniqueOptions}
      value={value}
      inputValue={value}
      filterOptions={(x) => x} // o filtro já é feito no servidor
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option[field] || ''
      }
      onInputChange={(_, text, reason) => {
        onTextChange?.(text || '');

        if (reason === 'input') {
          setSearch(text || '');
        }
      }}
      onChange={(_, selected) => {
        if (selected && typeof selected !== 'string') {
          onSelectOption?.(selected);
        }
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}