import React, { useState } from 'react';
import {
  Box,
  Container,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Stack,
  Fade,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { useAPI } from '../context/mainContext';

export default function Config() {
  const {
    isDarkMode,
    handleThemeChange,
    showTableView,
    handleChangeTableView,
    expensesType,
    arrCategories,
    handleSaveCategoryChanges,
  } = useAPI();

  const [hasChanges, setHasChanges] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  const [expenseValues, setExpenseValues] = useState(() =>
    arrCategories.reduce((acc, expense) => {
      acc[expense.id] = expense.maxValue;
      return acc;
    }, {})
  );




  const handleInputChange = (id, event) => {
    setHasChanges(true);
    const newValue = Number(event.target.value) || 0;
    setExpenseValues((prevValues) => ({
      ...prevValues,
      [id]: newValue,
    }));
  };

  const handleSaveChanges = () => {
    const updatedData = arrCategories.map((item) => ({
      ...item,
      maxValue:
        expenseValues[item.id] !== undefined
          ? expenseValues[item.id]
          : item.maxValue,
    }));

    handleSaveCategoryChanges(updatedData);
    setHasChanges(false);
  };

  const handleCancelChanges = () => {
    setExpenseValues(
      expensesType.reduce((acc, expense) => {
        acc[expense.id] = expense.maxValue;
        return acc;
      }, {})
    );
    setHasChanges(false);
  };

  const filteredCategories = arrCategories.filter(
    (expense) =>
      !['all_categories', 'revenue', 'credit_card', 'uncategorized'].includes(
        expense.id
      )
  );

  const totalMaxValue = filteredCategories.reduce((sum, item) => sum + item.maxValue, 0);

  return (
    <Container maxWidth='xl' sx={{ mt: 4, mb: 4 }}>
      {/* Preferências do usuário */}
      <Typography variant='h6' gutterBottom>
        Preferências do usuário
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Tema</TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Switch checked={isDarkMode} onChange={handleThemeChange} />
                  }
                  label={isDarkMode ? 'Dark' : 'Light'}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Modo de exibição</TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!showTableView}
                      onChange={() => handleChangeTableView(!showTableView)}
                    />
                  }
                  label={showTableView ? 'Tabela' : 'Card'}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Lock + Action Buttons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems='center'
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography variant='h6'>Valor gasto em todas categorias R$ {totalMaxValue}</Typography>
          <Fade in timeout={300}>
            <IconButton
              onClick={() => setIsLocked((prev) => !prev)}
              sx={{
                transition: 'transform 0.3s ease',
                transform: isLocked ? 'rotate(0deg)' : 'rotate(20deg)',
              }}
            >
              {isLocked ? (
                <LockIcon color='primary' />
              ) : (
                <LockOpenIcon color='secondary' />
              )}
            </IconButton>
          </Fade>
        </Stack>

        {hasChanges && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSaveChanges}
              disabled={isLocked}
            >
              Salvar
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={handleCancelChanges}
              disabled={isLocked}
            >
              Cancelar
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Category Table */}
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Valor (R$)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.label}</TableCell>
                <TableCell>
                  <NumericFormat
                    value={expenseValues[expense.id] || 0}
                    onValueChange={(values) => {
                      handleInputChange(expense.id, {
                        target: { value: values.floatValue },
                      });
                    }}
                    thousandSeparator='.'
                    decimalSeparator=','
                    prefix='R$ '
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    customInput={TextField}
                    size='small'
                    variant='outlined'
                    sx={{ width: 120 }}
                    disabled={isLocked}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
