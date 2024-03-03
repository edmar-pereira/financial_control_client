import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { v4 } from 'uuid';
import FormHelperText from '@mui/material/FormHelperText';
import { NumericFormat } from 'react-number-format';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';

import { useAPI } from '../context/mainContext';

export default function AddExpense() {
  const { addNewExpense, updateExpense, expensesType, selectedMonth } = useAPI();

  const param = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [ignore, setIgnore] = useState(false);
  const [id, setId] = useState('');
  const [validate, setValidate] = useState(false);
  const [disableAddBtn, setDisableAddBtn] = useState(true);
  const [extraFields, setExtraFields] = useState(false);
  const [totalMonths, setTotalMonths] = useState(1);

  const arrTotalMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  async function getDate() {
    const shortDate = new Date(date).toISOString().substring(0, 10);
    const obj = shortDate.split('-');
    const dateFormated = new Date(obj[0], obj[1] - 1, obj[2]); // 2009-11-10
    const dateConverted = dateFormated.toLocaleString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return dateConverted;
  }

  // function MoneyFormat(valueToFormat) {
  //   if (valueToFormat !== undefined) {
  //     return valueToFormat.toLocaleString('pt-br', {
  //       style: 'currency',
  //       currency: 'BRL',
  //     });
  //   }
  // }

  const resetForm = () => {
    setType('');
    setValue('');
    setDescription('');
    // setDate(new Date().toISOString());
    setIgnore(false);
    setValidate(false);
    setExtraFields(false);
    setTotalMonths(1);
  };

  const handleUpdateExpense = async () => {
    setValidate(true);
    const filteredType = expensesType.filter((e) => e.label === type);

    const newDate = await getDate();
    const splitedDate = newDate.split(' ');

    updateExpense(
      {
        type,
        avatarType: filteredType[0].id,
        value,
        ignore,
        description,
        date: dayjs(date).toISOString(),
        year: splitedDate[4],
        month: splitedDate[2].charAt(0).toUpperCase() + splitedDate[2].slice(1).toString(),
      },
      id
    );
    navigate('/');
    resetForm();
  };

  const handleAddNewExpense = async () => {
    setValidate(true);
    const filteredType = expensesType.filter((e) => e.label === type);

    const newDate = await getDate();
    const splitedDate = newDate.split(' ');

    addNewExpense({
      type,
      avatarType: filteredType[0].id,
      value,
      ignore,
      description,
      date: dayjs(date).toISOString(),
      year: splitedDate[4],
      month: splitedDate[2].charAt(0).toUpperCase() + splitedDate[2].slice(1).toString(),
      installment: totalMonths,
    });
    resetForm();
  };

  useEffect(() => {
    const { expenses } = selectedMonth;
    const data = expenses?.filter((e) => e._id === param.id);
    resetForm();
    if (data !== undefined && data.length > 0) {
      setType(data[0].type);
      setValue(data[0].value);
      setDescription(data[0].description);
      setDate(data[0].date);
      setIgnore(data[0].ignore);
      setId(data[0]._id);
    }
  }, [param.id]);

  useEffect(() => {
    if (type.length > 0 && description.length > 0 && value > 0) {
      setDisableAddBtn(false);
    } else {
      setDisableAddBtn(true);
    }
  }, [type, description, value]);

  return (
    <div className="form-container">
      <FormControl sx={{ m: 2, width: 300 }} error={type.length === 0 && validate} size="small">
        <InputLabel htmlFor="price-method-input">Tipo de gasto</InputLabel>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          label="Tipo de gasto"
          labelId="expense_type_id"
          size="sm"
        >
          {expensesType.map((item) => (
            <MenuItem id="expense_type_item" key={item.id} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{type.length === 0 && validate ? 'Campo obrigatório' : ''}</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 2, width: 300 }} size="small">
        <TextField
          id="description"
          label="Descrição"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText={description.length === 0 && validate ? 'Campo obrigatório' : ''}
          error={description.length === 0 && validate}
        />
      </FormControl>
      <FormControl sx={{ m: 2, width: 300 }} size="small">
        <NumericFormat
          key="number_format_value"
          value={value}
          id="monthlyContract"
          name="monthlyBaseline"
          label="Valor"
          variant="outlined"
          customInput={TextField}
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix="R$ "
          type="text"
          onValueChange={(values) => {
            const { floatValue } = values;
            setValue(floatValue);
          }}
          isAllowed={(values) => {
            const { floatValue } = values;
            return floatValue >= 0 && floatValue <= 100000000000;
          }}
          helperText={value.length === 0 && validate ? 'Campo obrigatório' : ''}
          error={value.length === 0 && validate}
        />
      </FormControl>
      <FormControl sx={{ m: 2, width: 300 }} size="small">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateField', 'DatePicker']}>
            <DatePicker
              label={!extraFields ? 'Data da despesa' : 'Primeiro mês debitado'}
              format="DD/MM/YYYY"
              defaultValue={dayjs(date)}
              onChange={(newValue) => setDate(new Date(newValue).toISOString())}
            />
          </DemoContainer>
        </LocalizationProvider>
      </FormControl>

      <Box display={!extraFields ? 'none' : ''}>
        <FormControl sx={{ m: 2, width: 300 }} size="small">
          <InputLabel htmlFor="total-months-html">Total de meses</InputLabel>
          <Select
            value={totalMonths}
            onChange={(e) => setTotalMonths(e.target.value)}
            label="Total de meses"
            labelId="total-months-id"
            size="sm"
          >
            {arrTotalMonths.map((item) => (
              <MenuItem key={`item-options-months=${v4()}`} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {type.length === 0 && validate ? 'Campo obrigatório' : ''}
          </FormHelperText>
        </FormControl>
      </Box>

      <FormControl sx={{ m: 2, width: 300 }}>
        <FormControlLabel
          control={<Checkbox checked={ignore} onChange={() => setIgnore(!ignore)} />}
          label="Ignorar transação"
        />
      </FormControl>

      <Box display={param.id.length === 24 ? 'none' : ''}>
        <FormControl sx={{ m: 2, width: 300 }} size="small">
          <FormControlLabel
            control={
              <Checkbox checked={extraFields} onChange={() => setExtraFields(!extraFields)} />
            }
            label="Compra parcelada"
          />
        </FormControl>
      </Box>
      <FormControl sx={{ m: 2, width: 300 }} size="small">
        <Button
          disabled={disableAddBtn}
          variant="contained"
          color="success"
          onClick={() => (param.id.length === 24 ? handleUpdateExpense() : handleAddNewExpense())}
        >
          {param.id.length === 24 ? 'Atualizar despesa' : 'Salvar despesa'}
        </Button>
      </FormControl>
    </div>
  );
}
