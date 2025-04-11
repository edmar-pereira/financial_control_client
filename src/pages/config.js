import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  Slider,
  TextField,
  Stack,
  Container,
  Button,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  minHeight: '54px',
  display: 'flex', // Added to enable flexbox
  alignItems: 'center', // Centers items vertically
  justifyContent: 'center', // Centers items horizontally
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const ExpenseItem = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: bgcolor,
}));

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

  const [expenseValues, setExpenseValues] = useState(() =>
    arrCategories.reduce((acc, expense) => {
      acc[expense.id] = expense.maxValue;
      return acc;
    }, {})
  );

  // useEffect(() => {
  //   console.log(hasChanges);
  // }, [hasChanges]);

  // useEffect(() => {
  //   console.log(expenseValues);
  // }, [expenseValues]);

  // useEffect(() => {
  //   console.log(expensesType);
  // }, [expensesType]);

  const handleSliderChange = (id, newValue) => {
    setHasChanges(true);
    setExpenseValues((prevValues) => ({
      ...prevValues,
      [id]: newValue,
    }));
  };

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

    setHasChanges(false); // Reset change indicator after saving
  };

  return (
    <Container maxWidth='xl'>
      <Box sx={{ flexGrow: 1, mt: '30px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <h3>Preferencias do usuário</h3>
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item>Tema</Item>
          </Grid>
          <Grid item xs={9}>
            <Item>
              <FormControlLabel
                control={
                  <Switch checked={isDarkMode} onChange={handleThemeChange} />
                }
                label={isDarkMode ? 'Dark' : 'Light'}
                labelPlacement='start'
              />
            </Item>
          </Grid>

          <Grid item xs={3}>
            <Item>Modo de exibição</Item>
          </Grid>
          <Grid item xs={9}>
            <Item>
              <FormControlLabel
                control={
                  <Switch
                    checked={!showTableView}
                    onChange={() => handleChangeTableView(!showTableView)}
                  />
                }
                label={showTableView ? 'Tabela' : 'Card'}
                labelPlacement='start'
              />
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <Box textAlign='center' width={'33%'}></Box>

              <Box textAlign='center' width={'33%'}>
                <h3 style={{ margin: 0 }}>Valor gasto na categoria</h3>
              </Box>

              {/* Right-aligned button */}
              <Box textAlign='center' width={'33%'}>
                {hasChanges && (
                  <Box>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveChanges}
                      size='small'
                      sx={{
                        mr: 2,
                        minWidth: 150,
                      }}
                    >
                      Salvar
                    </Button>

                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleCancelChanges}
                      size='small'
                      sx={{
                        mr: 2,
                        minWidth: 150,
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
            </Item>
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ flexGrow: 1, mt: '30px', mb: '30px', ml: '2px' }}
          >
            {arrCategories
              .filter(
                (expense) =>
                  ![
                    'all_categories',
                    'revenue',
                    'credit_card',
                    'uncategorized',
                  ].includes(expense.id)
              )
              .map((expense) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={expense.id}>
                  <ExpenseItem bgcolor={expense.color}>
                    <Typography>{expense.label}</Typography>
                    <Stack
                      direction='row'
                      spacing={2}
                      alignItems='center'
                      sx={{ mt: 1 }}
                    >
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
                        fixedDecimalScale={true}
                        allowNegative={false}
                        customInput={TextField}
                        variant='outlined'
                        label='Valor para categoria'
                        sx={{ width: '60%' }}
                        size='small'
                        inputProps={{
                          min: 0,
                          max: 5000,
                          step: 10,
                        }}
                      />

                      <Slider
                        value={expenseValues[expense.id] || 0}
                        min={0}
                        max={5000}
                        step={10}
                        onChange={(e, newValue) =>
                          handleSliderChange(expense.id, newValue)
                        }
                        aria-labelledby={`slider-${expense.id}`}
                        sx={{ width: '40%' }}
                      />
                    </Stack>
                  </ExpenseItem>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
