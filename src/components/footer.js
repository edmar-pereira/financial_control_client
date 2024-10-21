import React, { useEffect, useState } from 'react';

import { Box, Container, Grid, Typography } from '@mui/material';

import { useAPI } from '../context/mainContext';

export default function Footer() {
  const { selectedMonth, isDarkMode } = useAPI();

  const [unique, setUnique] = useState(0);

  const { difference, totalExp, totalRev } = selectedMonth;

  useEffect(() => {
    const { expenses } = selectedMonth;
    if (expenses?.length > 0) {
      const total = [...new Set(expenses.map((item) => item.type))];
      setUnique(total);
    }
  }, [selectedMonth]);

  function MoneyFormat(valueToFormat) {
    if (valueToFormat !== undefined) {
      return valueToFormat.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      });
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#1976d2',
        backgroundColor: isDarkMode ? '#1d1d1d' : '#1976d2',
        color: '#fff',
        paddingTop: '1rem',
        paddingBottom: '1rem',
      }}
    >
      <Container>
        <Grid container direction='row' alignItems='center'>
          <Grid item xs={4} style={{ padding: 5, textAlign: 'center' }}>
            <Typography
              color='#fff'
              variant='subtitle1'
              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
              {unique.length > 1 ? `Receita: ${MoneyFormat(totalRev)}` : null}
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: 5, textAlign: 'center' }}>
            <Typography
              color='#fff'
              variant='subtitle1'
              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
              {unique.length > 0 ? `Gasto: ${MoneyFormat(totalExp)}` : null}
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: 5, textAlign: 'center' }}>
            <Typography
              color='#fff'
              variant='subtitle1'
              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
              {unique.length > 1
                ? `Diferença: ${MoneyFormat(difference)}`
                : null}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
