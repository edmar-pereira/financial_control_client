import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Grid } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';

import { useAPI } from '../context/mainContext';
import { NumericFormatCustom } from '../components/numericFormatCustom';

import SelectCategory from '../components/selectCategory';

export default function AddExpense() {
  const {
    setMessage,
    arrCategories,
    selectedCategory,
    handleChangeCategory,
    setSelectedCategory,
  } = useAPI();

  const param = useParams();
  const navigate = useNavigate();

  const [expenseValue, setExpenseValue] = useState(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [ignore, setIgnore] = useState(false);
  const [validate, setValidate] = useState(false);
  const [disableAddBtn, setDisableAddBtn] = useState(true);
  const [extraFields, setExtraFields] = useState(false);
  const [totalMonths, setTotalMonths] = useState(1);
  const [searchedValue, setSearchedValue] = useState('');
  const arrTotalMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [currentMonth, setCurrentMonth] = useState([]);
  async function fetchData(params) {
    // console.log(params);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/getData`,
        params, // 🔹 Send as POST body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { data } = response.data;
      setCurrentMonth(data.expenses);
      // return data.expenses;
    } catch (error) {
      console.log(error.response.data.error);
      if (error.response) {
        setMessage({
          severity: 'error',
          content: error.response.data.error,
          show: true,
        });
      }
      return null; // optional: return null if error happens
    }
  }

  useEffect(() => {
    fetchData({
      startDate: new Date().toISOString().substring(0, 10),
      categoryIds: '',
    });
  }, [date]);

  const resetForm = () => {
    // setType('');
    setExpenseValue(0);
    setDescription('');
    setDate(new Date().toISOString());
    setIgnore(false);
    setValidate(false);
    setExtraFields(false);
    setTotalMonths(1);
  };

  const handleUpdateExpense = async () => {
    const obj = {
      date: date,
      description: description,
      ignore: ignore,
      categoryId: selectedCategory,
      value: expenseValue,
      currentInstallment: 1,
      totalInstallment: totalMonths,
    };

    await axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/update/${param.id}`,
        obj
      )
      .then((response) => {
        if (response.status === 200) {
          setMessage({
            severity: 'success',
            content: 'Atualizado com sucesso!',
            show: true,
          });
          resetForm();
          navigate('/');
        } else {
          setMessage({
            severity: 'error',
            content: 'Erro ao atualizar despesa',
            show: true,
          });
          // setLoading(false);
        }
      });
  };

  const handleAddNewExpense = async () => {
    const obj = {
      date: date,
      description: description,
      ignore: ignore,
      categoryId: selectedCategory,
      value: expenseValue,
      currentInstallment: 1,
      totalInstallment: totalMonths,
    };

    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/data/create`, obj)
      .then((response) => {
        if (response.status === 200) {
          setSelectedCategory('');
          resetForm();
          setMessage({
            severity: 'success',
            content: 'Cadastrado com sucesso!',
            show: true,
          });
        } else {
          setMessage({
            severity: 'error',
            content: 'Erro ao cadastrar despesa',
            show: true,
          });
        }
      });
  };

  const getExtpenses = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/getById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { data } = response.data;
      handleChangeCategory(data.categoryId);
      setExpenseValue(data.value);
      setDescription(data.description);
      setDate(data.date);
      setIgnore(data.ignore);
    } catch (error) {
      if (error.response) {
        setMessage({
          severity: 'error',
          content: error.response.statusText,
          show: true,
        });
      }
      return null;
    }
  };

  useEffect(() => {
    if (param.id !== ':id') {
      getExtpenses(param.id);
    }
  }, [param.id]);

  useEffect(() => {
    if (
      selectedCategory.length > 0 &&
      description.length > 0 &&
      expenseValue > 0
    ) {
      setDisableAddBtn(false);
      if (expenseValue && currentMonth) {
        const fileteredValue = currentMonth.filter(
          (item) =>
            parseFloat(item.value).toFixed(2) ===
            parseFloat(expenseValue).toFixed(2)
        );
        const grouped = fileteredValue.reduce((acc, entry) => {
          if (!acc[entry.value]) {
            acc[entry.value] = [];
          }
          acc[entry.value].push(entry);
          return acc;
        }, {});

        // Generate the message dynamically
        let message = '';
        const totalMatches = Object.values(grouped).flat().length;

        if (totalMatches === 0) {
          message = ''; // No matches
        } else if (totalMatches === 1) {
          const entry = fileteredValue[0];
          message = `Uma entrada foi encontrada:\n- Valor: R$ ${parseFloat(
            entry.value
          ).toFixed(2)}, Descrição: ${entry.description}, Data: ${new Date(
            entry.date
          ).toLocaleDateString('pt-BR')}`;
        } else {
          message = 'Foram encontradas entradas repetidas:\n';
          Object.entries(grouped).forEach(([value, entries]) => {
            entries.forEach((entry) => {
              message += `- Valor: R$ ${parseFloat(value).toFixed(
                2
              )}, Descrição: ${entry.description}, Data: ${new Date(
                entry.date
              ).toLocaleDateString('pt-BR')}\n`;
            });
          });
        }

        setSearchedValue(message);
      }
    } else {
      setDisableAddBtn(true);
    }
  }, [description, expenseValue]);

  return (
    <Box display='flex' justifyContent='center' sx={{ py: 4 }}>
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: '650px', // Adjust to fit two items per row (2 * 300px + spacing)
          justifyContent: 'center',
        }}
      >
        {/* Tipo de gasto */}
        <Grid item xs={12} sm={6} sx={{ maxWidth: '300px' }}>
          <FormControl
            size='small'
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                height: '56px', // Matches TextField height
              },
            }}
          >
            {arrCategories && selectedCategory !== undefined && (
              <SelectCategory />
            )}
            <FormHelperText>
              {selectedCategory.length === 0 && validate
                ? 'Campo obrigatório'
                : ''}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Descrição */}
        <Grid item xs={12} sm={6} sx={{ maxWidth: '300px' }}>
          <FormControl sx={{ width: '100%' }} size='small'>
            <TextField
              id='description'
              label='Descrição'
              variant='outlined'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText={
                description.length === 0 && validate ? 'Campo obrigatório' : ''
              }
              error={description.length === 0 && validate}
            />
          </FormControl>
        </Grid>

        {/* Valor */}
        <Grid item xs={12} sm={6} sx={{ maxWidth: '300px' }}>
          <FormControl sx={{ width: '100%', paddingTop: '8px' }} size='small'>
            <TextField
              label='Valor'
              value={expenseValue}
              onChange={(e) => setExpenseValue(e.target.value)}
              onFocus={(e) => e.target.select()}
              name='set-expense-value'
              id='expense-value'
              InputProps={{
                inputComponent: NumericFormatCustom,
              }}
              variant='outlined'
            />
          </FormControl>
        </Grid>

        {/* Data da despesa */}
        <Grid item xs={12} sm={6} sx={{ maxWidth: '309px', width: '100%' }}>
          <FormControl
            fullWidth
            sx={{ width: { xs: '284px', sm: '309px', paddingTop: '8px' } }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: { xs: '284px', sm: '309px' }, height: '56px' }}>
                <DatePicker
                  label={
                    !extraFields ? 'Data da despesa' : 'Primeiro mês debitado'
                  }
                  format='DD/MM/YYYY'
                  value={dayjs(date)}
                  onChange={(newValue) =>
                    setDate(new Date(newValue).toISOString())
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        width: { xs: '284px', sm: '309px' }, // Responsive width
                        height: '56px', // Fixed height
                      },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </FormControl>
        </Grid>

        {/* Total de meses (conditionally displayed) */}
        {extraFields && (
          <Grid item xs={12} sm={6} sx={{ maxWidth: '300px' }}>
            <FormControl sx={{ width: '100%' }} size='small'>
              <InputLabel htmlFor='total-months-html'>
                Total de meses
              </InputLabel>
              <Select
                value={totalMonths}
                onChange={(e) => setTotalMonths(e.target.value)}
                label='Total de meses'
                labelId='total-months-id'
              >
                {arrTotalMonths.map((item) => (
                  <MenuItem key={`item-options-months=${item}`} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {/* {type.length === 0 && validate ? 'Campo obrigatório' : ''}
                 */}{' '}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {/* Ignorar transação */}
        <Grid item xs={12} sm={6} sx={{ maxWidth: '300px' }}>
          <FormControl sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ignore}
                  onChange={() => setIgnore(!ignore)}
                />
              }
              label='Ignorar transação'
            />
          </FormControl>
        </Grid>

        {/* Compra parcelada */}
        {param.id.length !== 24 && (
          <Grid item xs={12} sm={6} sx={{ maxWidth: '300px' }}>
            <FormControl sx={{ width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={extraFields}
                    onChange={() => setExtraFields(!extraFields)}
                  />
                }
                label='Compra parcelada'
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={12}>
          {searchedValue.length > 0 && (
            <div style={{ color: 'red', marginBottom: '16px' }}>
              <strong>Foram encontradas entradas repetidas:</strong>
              <pre>{searchedValue}</pre>
            </div>
          )}
        </Grid>

        {/* Save/Update Button */}
        <Grid item xs={12} sx={{ maxWidth: '300px' }}>
          <FormControl sx={{ width: '100%' }}>
            <Button
              disabled={disableAddBtn}
              variant='contained'
              color='success'
              onClick={() =>
                param.id.length === 24
                  ? handleUpdateExpense()
                  : handleAddNewExpense()
              }
            >
              {param.id.length === 24 ? 'Atualizar despesa' : 'Salvar despesa'}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
