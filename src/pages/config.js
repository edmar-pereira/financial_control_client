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
  } = useAPI();

  const [hasChanges, setHasChanges] = useState(false);

  const [expenseValues, setExpenseValues] = useState(
    expensesType.reduce((acc, expense) => {
      acc[expense.id] = expense.maxValue;
      return acc;
    }, {})
  );

  useEffect(() => {
    console.log(hasChanges);
  }, [hasChanges]);

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
    console.log('Changes saved:', expenseValues);
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
              <h3>Valor gasto na categoria</h3>
            </Item>
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ flexGrow: 1, mt: '30px', mb: '30px', ml: '2px' }}
          >
            {expensesType
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
                      <TextField
                        variant='outlined'
                        label='Max Value'
                        type='number'
                        value={expenseValues[expense.id]}
                        onChange={(e) => handleInputChange(expense.id, e)}
                        InputProps={{
                          inputProps: { min: 0, max: 5000, step: 10 },
                        }}
                        sx={{ width: '60%' }}
                        size='small'
                      />
                      <Slider
                        value={expenseValues[expense.id]}
                        min={0}
                        max={5000} // Adjust as needed
                        step={10} // Adjust as needed
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
          {hasChanges && (
            <Button
              variant='contained'
              color='primary'
              onClick={handleSaveChanges}
              sx={{
                position: 'fixed',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
              }}
            >
              Save Changes
            </Button>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
