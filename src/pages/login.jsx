import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAPI } from '../context/mainContext';

export default function Login() {
  const navigate = useNavigate();
  const { setMessage, setLoading } = useAPI();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);

      navigate('/');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erro ao realizar login';

      setMessage({
        severity: 'error',
        content: msg,
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper
        elevation={4}
        sx={{
          mt: 10,
          p: 5,
          borderRadius: 3,
        }}
      >
        <Typography variant='h4' align='center' sx={{ mb: 3 }}>
          Financial Control
        </Typography>

        <Typography variant='body2' align='center' sx={{ mb: 4 }}>
          Faça login para acessar o sistema
        </Typography>

        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              label='Email'
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label='Senha'
              type='password'
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant='contained' size='large' type='submit'>
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
