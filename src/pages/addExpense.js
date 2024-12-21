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

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator='.'
      decimalSeparator=','
      decimalScale={2}
      fixedDecimalScale
      prefix='R$ '
    />
  );
});

export default function AddExpense() {
  const { addNewExpense, updateExpense, expensesType, selectedMonth } =
    useAPI();

  const param = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [expenseValue, setExpenseValue] = useState(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [ignore, setIgnore] = useState(false);
  const [id, setId] = useState('');
  const [validate, setValidate] = useState(false);
  const [disableAddBtn, setDisableAddBtn] = useState(true);
  const [extraFields, setExtraFields] = useState(false);
  const [totalMonths, setTotalMonths] = useState(1);

  const arrTotalMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const filteredCategory = expensesType.filter(
    (item) => item.label !== 'Cartão de Crédito' && item.label !== 'Filhos'
  );

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

  const resetForm = () => {
    setType('');
    setExpenseValue(0);
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
        value: expenseValue,
        ignore,
        description,
        date: dayjs(date).toISOString(),
        year: splitedDate[4],
        month:
          splitedDate[2].charAt(0).toUpperCase() +
          splitedDate[2].slice(1).toString(),
      },
      id
    );
    // resetForm();
    navigate('/');
  };

  const handleAddNewExpense = async () => {
    setValidate(true);
    const filteredType = expensesType.filter((e) => e.label === type);

    const newDate = await getDate();
    const splitedDate = newDate.split(' ');

    addNewExpense({
      type,
      avatarType: filteredType[0].id,
      value: expenseValue,
      ignore,
      description,
      date: dayjs(date).toISOString(),
      year: splitedDate[4],
      month:
        splitedDate[2].charAt(0).toUpperCase() +
        splitedDate[2].slice(1).toString(),
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
      setExpenseValue(data[0].value);
      setDescription(data[0].description);
      setDate(data[0].date);
      setIgnore(data[0].ignore);
      setId(data[0]._id);
    }
  }, [param.id]);

  useEffect(() => {
    if (type.length > 0 && description.length > 0 && expenseValue > 0) {
      setDisableAddBtn(false);
    } else {
      setDisableAddBtn(true);
    }
  }, [type, description, expenseValue]);

  return (
    <div className='form-container'>
      <FormControl
        sx={{ m: 2, width: 300 }}
        error={type.length === 0 && validate}
        size='small'
      >
        <InputLabel htmlFor='price-method-input'>Tipo de gasto</InputLabel>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          label='Tipo de gasto'
          labelId='expense_type_id'
          size='sm'
        >
          {filteredCategory.map((item) => (
            <MenuItem id='expense_type_item' key={item.id} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {type.length === 0 && validate ? 'Campo obrigatório' : ''}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 2, width: 300 }} size='small'>
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
      <FormControl sx={{ m: 2, width: 300 }} size='small'>
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
        {/* <NumericFormat
        //   key='number_format_value'
        //   value={expenseValue}
        //   id='value'
        //   name='value'
        //   label='Valor'
        //   variant='outlined'
        //   customInput={TextField}
        //   thousandSeparator
        //   decimalScale={2}
        //   fixedDecimalScale
        //   prefix='R$ '
        //   type='text'
        //   onValueChange={(values) => {
        //     const { floatValue } = values;
        //     setExpenseValue(floatValue);
        //   }}
        //   isAllowed={(values) => {
        //     const { floatValue } = values;
        //     return floatValue >= 0 && floatValue <= 100000000000;
        //   }}
        //   helperText={expenseValue === 0 && validate ? 'Campo obrigatório' : ''}
        //   error={expenseValue === 0 && validate}
    // />*/}
      </FormControl>
      <FormControl sx={{ m: 2, width: 300 }} size='small'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateField', 'DatePicker']}>
            <DatePicker
              label={!extraFields ? 'Data da despesa' : 'Primeiro mês debitado'}
              format='DD/MM/YYYY'
              defaultValue={dayjs(date)}
              onChange={(newValue) => setDate(new Date(newValue).toISOString())}
            />
          </DemoContainer>
        </LocalizationProvider>
      </FormControl>

      <Box display={!extraFields ? 'none' : ''}>
        <FormControl sx={{ m: 2, width: 300 }} size='small'>
          <InputLabel htmlFor='total-months-html'>Total de meses</InputLabel>
          <Select
            value={totalMonths}
            onChange={(e) => setTotalMonths(e.target.value)}
            label='Total de meses'
            labelId='total-months-id'
            size='sm'
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
          control={
            <Checkbox checked={ignore} onChange={() => setIgnore(!ignore)} />
          }
          label='Ignorar transação'
        />
      </FormControl>

      <Box display={param.id.length === 24 ? 'none' : ''}>
        <FormControl sx={{ m: 2, width: 300 }} size='small'>
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
      </Box>
      <FormControl sx={{ m: 2, width: 300 }} size='small'>
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
    </div>
  );
}
