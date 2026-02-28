import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Grid,
  Autocomplete,
  FormControl,
  MenuItem,
  Checkbox,
  Box,
  InputLabel,
  Select,
  FormControlLabel,
  Button,
} from '@mui/material';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useAPI } from '../context/mainContext';
import ShiftedCurrencyInput from '../components/ShiftedCurrencyInput';
import SelectCategory from '../components/selectCategory';
import PaymentTypeSelect from '../components/PaymentTypeSelect';

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
  const arrTotalMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const [fantasyName, setFantasyName] = useState('');
  const [name, setName] = useState('');
  const [paymentType, setPaymentType] = useState('');

  // ✅ Company autocomplete
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyInput, setCompanyInput] = useState('');

  // ✅ Description autocomplete
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  /* =========================================
     COMPANY AUTOCOMPLETE
  ========================================= */
  useEffect(() => {
    if (!companyInput || companyInput.trim().length < 2) {
      setCompanyOptions([]);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/data/getUniqueCompanyName`,
          { params: { name: companyInput.trim() } },
        );

        // console.log('Resposta da API de empresas:', res.data.data);

        if (Array.isArray(res.data.data)) {
          setCompanyOptions(res.data.data);
        }
      } catch (err) {
        console.error('Erro ao buscar empresas', err);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [companyInput]);

  /* =========================================
     DESCRIPTION AUTOCOMPLETE
  ========================================= */
  useEffect(() => {
    if (!inputValue || inputValue.trim().length < 2) {
      setDescriptionOptions([]);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/data/getUniqueDescriptions`,
          { params: { description: inputValue.trim() } },
        );

        // console.log(res.data.data);

        if (Array.isArray(res.data.data)) {
          setDescriptionOptions(res.data.data);
        }
      } catch (err) {
        console.error('Erro ao buscar descriptions', err);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [inputValue]);

  /* =========================================
     FORM FUNCTIONS
  ========================================= */

  const resetForm = () => {
    setExpenseValue(0);
    setDescription('');
    setInputValue('');
    setCompanyInput('');
    setName('');
    setIgnore(false);
    setValidate(false);
    setExtraFields(false);
    setTotalMonths(1);
    setFantasyName('');
    setPaymentType('');
  };

  const buildPayload = () => ({
    date,
    description,
    ignore: ignore !== undefined ? ignore : false,
    categoryId: selectedCategory,
    value: expenseValue,
    currentInstallment: 1,
    totalInstallment: extraFields ? totalMonths : 1,
    fantasyName,
    name,
    paymentType,
    updatedAt: new Date().toISOString(),
  });

  const handleUpdateExpense = async () => {
    const payload = buildPayload();

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/data/update/${param.id}`,
      payload,
    );

    setMessage({
      severity: 'success',
      content: 'Atualizado com sucesso!',
      show: true,
    });

    resetForm();
    navigate('/');
  };

  const handleAddNewExpense = async () => {
    if (!paymentType) {
      setValidate(true);
      return;
    }

    const payload = buildPayload();

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/data/create`,
      payload,
    );

    setSelectedCategory('');
    resetForm();

    setMessage({
      severity: 'success',
      content: 'Cadastrado com sucesso!',
      show: true,
    });
  };

  const getExpenses = async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/data/getById/${id}`,
    );

    const { data } = response.data;

    handleChangeCategory(data.categoryId);
    setExpenseValue(data.value);
    setDescription(data.description);
    setInputValue(data.description);
    setDate(data.date);
    setIgnore(data.ignore);
    setFantasyName(data.fantasyName || '');
    setName(data.name || '');
    setCompanyInput(data.name || '');
    setPaymentType(data.paymentType || '');

    if (data.totalInstallment > 1) {
      setExtraFields(true);
      setTotalMonths(data.totalInstallment);
    }
  };

  useEffect(() => {
    if (param.id && param.id.length === 24) {
      getExpenses(param.id);
    }
  }, [param.id]);

  useEffect(() => {
    if (selectedCategory && description && expenseValue > 0) {
      setDisableAddBtn(false);
    } else {
      setDisableAddBtn(true);
    }
  }, [selectedCategory, description, expenseValue]);

  /* =========================================
     UI
  ========================================= */

  return (
    <Box display='flex' justifyContent='center' sx={{ py: 4 }}>
      <Grid container spacing={2} sx={{ maxWidth: 650 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Nome Fantasia'
            value={fantasyName}
            onChange={(e) => setFantasyName(e.target.value)}
          />
        </Grid>

        {/* COMPANY AUTOCOMPLETE */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={companyOptions}
            inputValue={companyInput}
            onInputChange={(e, value) => {
              setCompanyInput(value);
              setName(value);
            }}
            onChange={(e, value) => {
              if (value) {
                setCompanyInput(value);
                setName(value);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label='Nome da Empresa' fullWidth />
            )}
          />
        </Grid>

        {/* DESCRIPTION AUTOCOMPLETE */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={descriptionOptions}
            inputValue={inputValue}
            onInputChange={(e, v) => {
              setInputValue(v);
              setDescription(v);
            }}
            onChange={(e, v) => {
              if (v) {
                setInputValue(v);
                setDescription(v);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label='Descrição' />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ShiftedCurrencyInput
            fullWidth
            label='Valor'
            value={expenseValue * 100}
            onChange={(cents) => setExpenseValue((cents / 100).toFixed(2))}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          {arrCategories && <SelectCategory selectedType={selectedCategory} />}
        </Grid>

        <Grid item xs={12} sm={6}>
          <PaymentTypeSelect
            value={paymentType}
            onChange={setPaymentType}
            error={validate && !paymentType}
            helperText={validate && !paymentType ? 'Campo obrigatório' : ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Data da despesa'
              format='DD/MM/YYYY'
              value={dayjs(date)}
              onChange={(v) => setDate(new Date(v).toISOString())}
              slotProps={{
                textField: { fullWidth: true, size: 'small' },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {param.id?.length !== 24 && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={extraFields}
                    onChange={() => setExtraFields(!extraFields)}
                  />
                }
                label='Compra parcelada'
              />
            </Grid>

            {extraFields && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Parcelas</InputLabel>
                  <Select
                    value={totalMonths}
                    label='Parcelas'
                    onChange={(e) => setTotalMonths(e.target.value)}
                  >
                    {arrTotalMonths.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}x
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </>
        )}

        <Grid item xs={12}>
          <Button
            fullWidth
            disabled={disableAddBtn}
            variant='contained'
            color='success'
            onClick={() =>
              param.id?.length === 24
                ? handleUpdateExpense()
                : handleAddNewExpense()
            }
          >
            {param.id?.length === 24 ? 'Atualizar despesa' : 'Salvar despesa'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
